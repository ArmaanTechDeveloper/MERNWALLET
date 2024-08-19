import { atom } from "recoil";
export interface wallet {
    publickey: string,
    secret: string
}
export const onboarding = atom({
    key: 'onboardingAtom' ,
    default: false
})
export const network = atom({
    key:"networkAtom",
    default: "none"
})
export const solWALLETS = atom<wallet []>({
    key: "solanaWalletsAtom",
    default: []
})
export const ethWALLETS = atom<wallet []>({
    key: "ethereumWalletsAtom",
    default: []
})