import { Component } from '@theme/component';
import { StandardEvents, ProductSelectEvent } from '@shopify/events';

/**
 * @typedef {Object} SellingPlanPrice
 * @property {string} price
 * @property {string | null} [compareAt]
 */

/**
 * @typedef {Object} SellingPlanVariantData
 * @property {string} oneTimePrice
 * @property {Record<string, SellingPlanPrice>} plans
 */

/**
 * @typedef {Object} SellingPlanPickerData
 * @property {string | number} defaultVariantId
 * @property {Record<string, SellingPlanVariantData>} variants
 */

/**
 * @typedef {Object} SellingPlanPickerRefs
 * @property {HTMLInputElement} sellingPlanInput
 * @property {HTMLScriptElement} planData
 * @property {HTMLInputElement[]} [purchaseOption]
 * @property {HTMLElement} [oneTimePrice]
 * @property {HTMLElement} [subscribePrice]
 * @property {HTMLElement} [frequencyWrapper]
 * @property {HTMLSelectElement} [frequencySelect]
 */

/**
 * Native selling-plan picker. Writes `selling_plan` on the product form and
 * updates nearby price displays. Only used when Liquid rendered recurring plans.
 *
 * @extends {Component<SellingPlanPickerRefs>}
 */
class SellingPlanPicker extends Component {
  requiredRefs = ['sellingPlanInput', 'planData'];

  /** @type {SellingPlanPickerData | null} */
  #data = null;

  /** @type {string} */
  #variantId = '';

  /** @type {AbortController} */
  #abortController = new AbortController();

  connectedCallback() {
    super.connectedCallback();

    this.#data = this.#parsePlanData();
    this.#variantId = this.dataset.variantId || String(this.#data?.defaultVariantId || '');

    const { signal } = this.#abortController;
    this.addEventListener('change', this.#handleChange, { signal });

    const section = this.closest('.shopify-section, dialog');
    section?.addEventListener(StandardEvents.productSelect, this.#onProductSelect, { signal });

    this.#sync(true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController.abort();
  }

  /**
   * @returns {SellingPlanPickerData | null}
   */
  #parsePlanData() {
    const raw = this.refs.planData?.textContent;
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /** @param {Event} event */
  #handleChange = (event) => {
    if (event.target === this.refs.sellingPlanInput) return;

    this.#sync();
  };

  /**
   * @param {ProductSelectEvent} event
   */
  #onProductSelect = async (event) => {
    if (!(event.target instanceof Element) || event.target.closest('product-card')) return;

    try {
      const { detail } = await event.promise;
      // Let product-price replace its container from the same event first.
      await Promise.resolve();

      const resourceId = detail?.resource?.id;
      if (resourceId == null) return;

      this.#variantId = String(resourceId);
      this.dataset.variantId = this.#variantId;
      this.#updateOptionPrices();
      this.#sync();
    } catch (error) {
      if (error?.name !== 'AbortError') console.warn('[selling-plan-picker] Event promise rejected:', error);
    }
  };

  /**
   * @param {boolean} [announce]
   */
  #sync(announce = false) {
    const sellingPlanId = this.#resolveSelectedPlanId();
    this.#setSellingPlanValue(sellingPlanId, announce);
    this.#syncPaymentTermsForm(sellingPlanId);
    this.#toggleFrequency(Boolean(sellingPlanId));
    this.#updateSelectedClass();
    this.#updateOptionPrices();
    this.#updatePriceDisplays(sellingPlanId);
  }

  /**
   * @returns {string}
   */
  #resolveSelectedPlanId() {
    const selectedOption = this.#selectedPurchaseOption();
    if (!selectedOption || selectedOption.dataset.purchaseType !== 'subscribe') return '';

    const frequencySelect = this.refs.frequencySelect;
    if (frequencySelect?.value) return frequencySelect.value;

    return selectedOption.value || '';
  }

  /**
   * @returns {HTMLInputElement | undefined}
   */
  #selectedPurchaseOption() {
    const options = this.refs.purchaseOption;
    if (!options) return undefined;

    const list = Array.isArray(options) ? options : [options];
    return list.find((option) => option.checked);
  }

  /**
   * @param {string} sellingPlanId
   * @param {boolean} [announce]
   */
  #setSellingPlanValue(sellingPlanId, announce = false) {
    const input = this.refs.sellingPlanInput;
    const changed = input.value !== sellingPlanId;

    if (changed) input.value = sellingPlanId;
    if (!changed && !announce) return;

    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /**
   * Shop Pay installment terms live in a sibling product form. Keep its
   * selling_plan in sync so those terms match Subscribe vs One-time.
   *
   * @param {string} sellingPlanId
   */
  #syncPaymentTermsForm(sellingPlanId) {
    const section = this.closest('.shopify-section');
    if (!section) return;

    const forms = section.querySelectorAll('form.payment-terms');
    for (const form of forms) {
      let planInput = form.querySelector('input[name="selling_plan"]');
      if (!planInput) {
        planInput = document.createElement('input');
        planInput.type = 'hidden';
        planInput.name = 'selling_plan';
        planInput.autocomplete = 'off';
        form.append(planInput);
      }

      if (planInput.value === sellingPlanId) continue;

      planInput.value = sellingPlanId;
      planInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * @param {boolean} isSubscribe
   */
  #toggleFrequency(isSubscribe) {
    const wrapper = this.refs.frequencyWrapper;
    if (!wrapper) return;

    wrapper.hidden = !isSubscribe;
  }

  #updateSelectedClass() {
    const options = this.refs.purchaseOption;
    if (!options) return;

    const list = Array.isArray(options) ? options : [options];
    for (const option of list) {
      option.closest('.selling-plan-picker__option')?.classList.toggle(
        'selling-plan-picker__option--selected',
        option.checked
      );
    }
  }

  #updateOptionPrices() {
    const variantData = this.#variantData();
    if (!variantData) return;

    if (this.refs.oneTimePrice) {
      this.refs.oneTimePrice.textContent = variantData.oneTimePrice;
    }

    const subscribePrice = this.refs.subscribePrice;
    if (!subscribePrice) return;

    const planId = this.refs.frequencySelect?.value || this.#firstPlanId(variantData);
    const plan = planId ? variantData.plans[planId] : undefined;
    subscribePrice.textContent = plan?.price || variantData.oneTimePrice;
  }

  /**
   * @param {string} sellingPlanId
   */
  #updatePriceDisplays(sellingPlanId) {
    const variantData = this.#variantData();
    if (!variantData) return;

    const plan = sellingPlanId ? variantData.plans[sellingPlanId] : undefined;
    const price = plan?.price || variantData.oneTimePrice;
    const compareAt = plan?.compareAt && plan.compareAt !== price ? plan.compareAt : '';

    for (const container of this.#priceContainers()) {
      this.#renderPrice(container, price, compareAt);
    }
  }

  /**
   * @returns {SellingPlanVariantData | undefined}
   */
  #variantData() {
    return this.#data?.variants[this.#variantId];
  }

  /**
   * @param {SellingPlanVariantData} variantData
   * @returns {string}
   */
  #firstPlanId(variantData) {
    const ids = Object.keys(variantData.plans);
    return ids[0] || '';
  }

  /**
   * @returns {HTMLElement[]}
   */
  #priceContainers() {
    const section = this.closest('.shopify-section');
    if (!section) return [];

    return Array.from(
      section.querySelectorAll('product-price [ref="priceContainer"], .sticky-add-to-cart__price [ref="priceContainer"]')
    );
  }

  /**
   * @param {HTMLElement} container
   * @param {string} price
   * @param {string} compareAt
   */
  #renderPrice(container, price, compareAt) {
    const saleLabel = this.dataset.priceSaleLabel || '';
    const regularLabel = this.dataset.priceRegularLabel || '';
    const fragment = document.createDocumentFragment();

    if (compareAt) {
      fragment.append(this.#priceGroup('price', saleLabel, price));
      fragment.append(document.createTextNode(' '));
      fragment.append(this.#priceGroup('price-item--regular compare-at-price', regularLabel, compareAt));
    } else {
      const span = document.createElement('span');
      span.className = 'price';
      span.textContent = price;
      fragment.append(span);
    }

    container.replaceChildren(fragment);
  }

  /**
   * @param {string} className
   * @param {string} hiddenLabel
   * @param {string} amount
   * @returns {HTMLSpanElement}
   */
  #priceGroup(className, hiddenLabel, amount) {
    const group = document.createElement('span');
    group.className = `price-item__group ${className}`;

    if (hiddenLabel) {
      const label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = `${hiddenLabel}\u00a0`;
      group.append(label);
    }

    group.append(document.createTextNode(amount));
    return group;
  }
}

if (!customElements.get('selling-plan-picker')) {
  customElements.define('selling-plan-picker', SellingPlanPicker);
}
