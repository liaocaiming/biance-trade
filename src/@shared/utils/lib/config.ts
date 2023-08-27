interface Url {
  [key: string]: string
}

interface IList {
  urls: Url;
  prefix: string;
}

 type res = {
   [k in keyof Url]: string
 }

export default (list: IList[]):res  => {
  const res = {};
  if (!Array.isArray(list)) {
    return res;
  }
  list.forEach((item) => {
    const { urls, prefix } = item; 
    Object.keys(urls).forEach((key: string) => {
      return Object.assign(res, { [key]: `${prefix}${urls[key]}`})
    })
  })
  return res
}