export class ManageUserModel {
  modifyManageUserData = (data: any, addUserForm: any) => {
    // console.log(data, addUserForm, 'jjjjjjjjjjjjjj')
    const countryIdIndex = addUserForm?.countryId?.options?.findIndex(
      (item: any) => item?.name == data?.countryName
    )
    data.countryId =
      countryIdIndex > -1 &&
      addUserForm?.countryId?.options[countryIdIndex].value

    const stateIdIndex = addUserForm?.stateId?.options?.findIndex(
      (item: any) => item?.name == data?.stateName
    )
    data.stateId =
      stateIdIndex > -1 && addUserForm?.stateId?.options[stateIdIndex].value

    const cityIdIndex = addUserForm?.cityId?.options?.findIndex(
      (item: any) => item?.name == data?.cityName
    )
    data.cityId =
      cityIdIndex > -1 && addUserForm?.cityId?.options[cityIdIndex].value
    return data
  }
}
