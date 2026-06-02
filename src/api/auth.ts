import api from "./request"

export const loginCellphone = (data: { phone: string; password?: string; md5_password?: string; captcha?: string; countrycode?: string }) =>
  api.post("/login/cellphone", data) as Promise<any>

export const loginEmail = (data: { email: string; password?: string; md5_password?: string }) =>
  api.post("/login", data) as Promise<any>

export const loginQrKey = () =>
  api.get("/login/qr/key") as Promise<any>

export const loginQrCreate = (key: string, qrimg = true) =>
  api.get("/login/qr/create", { params: { key, qrimg } }) as Promise<any>

export const loginQrCheck = (key: string) =>
  api.get("/login/qr/check", { params: { key } }) as Promise<any>

export const loginStatus = () =>
  api.get("/login/status") as Promise<any>

export const loginRefresh = () =>
  api.get("/login/refresh") as Promise<any>

export const logout = () =>
  api.get("/logout") as Promise<any>

export const registerAnonimous = () =>
  api.get("/register/anonimous") as Promise<any>

export const captchaSent = (phone: string, ctcode = "86") =>
  api.get("/captcha/sent", { params: { phone, ctcode } }) as Promise<any>

export const captchaVerify = (phone: string, captcha: string, ctcode = "86") =>
  api.get("/captcha/verify", { params: { phone, captcha, ctcode } }) as Promise<any>

export const registerCellphone = (data: { phone: string; password: string; captcha: string; nickname: string; countrycode?: string }) =>
  api.post("/register/cellphone", data) as Promise<any>