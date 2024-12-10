export class AuthModel {
  modifyUserInfo = (data: any) => {
    const responseData = data
    responseData.user.role = responseData.user.roles.map(
      (item: any) => item.role
    )
    return responseData
  }
  modifyValidateTokenData = (data: any) => {
    const responseData = data
    responseData.role = data.roles.map((item: any) => item.role)
    return responseData
  }
}
