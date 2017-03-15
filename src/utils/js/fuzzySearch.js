import deepAccess from './deepAccess'

let getBigrams, stringSimilarity

getBigrams = function (string) {
  var i, j, ref, s, v
  s = string.toLowerCase()
  v = new Array(s.length - 1)
  for (i = j = 0, ref = v.length; j <= ref; i = j += 1) {
    v[i] = s.slice(i, i + 2)
  }
  return v
}

stringSimilarity = function (str1, str2) {
  var hitCount, j, k, len, len1, pairs1, pairs2, union, x, y
  if (str1.length > 0 && str2.length > 0) {
    pairs1 = getBigrams(str1)
    pairs2 = getBigrams(str2)
    union = pairs1.length + pairs2.length
    hitCount = 0
    for (j = 0, len = pairs1.length; j < len; j++) {
      x = pairs1[j]
      for (k = 0, len1 = pairs2.length; k < len1; k++) {
        y = pairs2[k]
        if (x === y) {
          hitCount++
        }
      }
    }
    if (hitCount > 0) {
      return (2.0 * hitCount) / union
    }
  }
  return 0.0
}

export default function (query, list, key, tolerance) {
  const MIN_RELEVANCE = 0.20
  let results = []

  list.forEach(function (element) {
    let value = deepAccess(element, key)
    let relevance = stringSimilarity(query, value)

    if (tolerance === undefined) {
      if (relevance >= MIN_RELEVANCE) {
        results.push(element)
      }
    } else {
      if (relevance >= tolerance) {
        results.push(element)
      }
    }
  })

  return results
}
