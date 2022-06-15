/** Callback for establishing or re-stablishing mongo connection */
export interface IOnConnectedCallback {
    (): void;
}