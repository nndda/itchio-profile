function hash(data: Uint8Array<ArrayBuffer>) {
  const hasher = new Bun.CryptoHasher("sha512");
  hasher.update(data);
  return hasher.digest("hex");
}

function errNetwork(res: Response) {
  console.error(`network: could not get '${res.url}': ${res.status} - ${res.statusText}`);
}

export async function chooseOldest(
  urlTags: string[],
  urlMain: string,
): Promise<string> {

  const resCurrent = await fetch(urlMain);

  if (!(resCurrent.ok)) {
    errNetwork(resCurrent);
    return urlMain;
  }

  const hashCurrent = hash(await resCurrent.bytes());

  for (const tag of urlTags) {
    console.log(`Fetching ${tag}...`)
    const res = await fetch(tag);

    if (!(res.ok)) {
      errNetwork(res);
      continue;
    }

    if (hash(await res.bytes()) === hashCurrent) {
      return tag;
    }
  }

  return urlMain;
}


export async function chooseNonStale(
  urlOld: string,
  urlNew: string,
): Promise<string> {
  const [ resOld, resNew ] = await Promise.all([
    fetch(urlOld),
    fetch(urlNew),
  ]);

  for (const res of [resOld, resNew]) {
    // TODO: conditional fallback
    if (!(res.ok)) {
      errNetwork(res);
      return urlNew;
    }
  }

  const [ bytesOld, bytesNew ] = await Promise.all([
    resOld.bytes(),
    resNew.bytes(),
  ]);

  const
    hashOld = hash(bytesOld)
  , hashNew = hash(bytesNew)
  ;

  if (hashOld === hashNew) {
    return urlOld;
  }

  return urlNew;
}
