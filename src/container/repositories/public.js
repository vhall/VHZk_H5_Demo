export const publicInterface = {
  queryCompanyList () {},
  queryPersonnelList () {},
  addCompany () {},
  addPersonnel () {},
  clearCompany () {},
  clearPersonnel () {}
}
let companyList = null
let personneList = null
export default {
  /* 查询公司库 */
  queryCompanyList (data) {
    return new Promise((resolve) => {
      let list = companyList || (JSON.parse(localStorage.getItem('companyList')) || [])
      companyList = list
      let flList = list.filter((item) => {
        return item.indexOf(data.keyword) !== -1
      })
      resolve(flList.slice(0, data.size))
    })
  },
  /* 查询职务库 */
  queryPersonnelList (data) {
    return new Promise((resolve) => {
      let list = personneList || (JSON.parse(localStorage.getItem('personneList')) || [])
      personneList = list
      let flList = list.filter((item) => {
        return item.indexOf(data.keyword) !== -1
      })
      resolve(flList.slice(0, data.size))
    })
  },
  addCompany (name) {
    if (!name) return
    let list = companyList || (JSON.parse(localStorage.getItem('companyList')) || [])
    let result = list.every((item) => {
      return item !== name
    })
    if (result || list.length === 0) {
      list.push(name)
      companyList = list
      localStorage.setItem('companyList', JSON.stringify(list))
    }
  },
  addPersonnel (name) {
    if (!name) return
    let list = personneList || (JSON.parse(localStorage.getItem('personneList')) || [])
    let result = list.every((item) => {
      return item !== name
    })
    if (result || list.length === 0) {
      list.push(name)
      personneList = list
      localStorage.setItem('personneList', JSON.stringify(list))
    }
  },
  clearCompany () {
    localStorage.removeItem('companyList')
    companyList = null
  },
  clearPersonnel () {
    localStorage.removeItem('personneList')
    personneList = null
  }
}
