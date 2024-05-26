javascript: setInterval(async function () {
  /* xpathでの要素指定 */
  document.getElementByXPath = function (sValue) {
    var a = this.evaluate(sValue, this, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (a.snapshotLength > 0) {return a.snapshotItem(0);}
  };

  /* 待機する関数 */
  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time)); /* timeはミリ秒 */

  /* 絵文字除去 */
  const ranges = [
    "[\ud800-\ud8ff][\ud000-\udfff]" /*  基本的な絵文字除去 */,
    "[\ud000-\udfff]{2,}" /*  サロゲートペアの二回以上の繰り返しがあった場合 */,
    "\ud7c9[\udc00-\udfff]" /*  特定のシリーズ除去 */,
    "[0-9|*|#][\uFE0E-\uFE0F]\u20E3" /*  数字系絵文字 */,
    "[0-9|*|#]\u20E3" /*  数字系絵文字 */,
    "[©|®|\u2010-\u3fff][\uFE0E-\uFE0F]" /*  環境依存文字や日本語との組み合わせによる絵文字 */,
    "[\u2010-\u2FFF]" /*  指や手、物など、単体で絵文字となるもの */,
    "\uA4B3" /*  数学記号の環境依存文字の除去 */,
  ];
  const surrogatePairCode = [65038, 65039, 8205, 11093, 11035];
  const removeEmoji = (in_value) => {
    const reg = new RegExp(ranges.join("|"), "g");
    let retValue = in_value.replace(reg, "");
    /* パターンにマッチする限り、除去を繰り返す（一回の正規表現除去では除去しきないパターンがあるため）*/
    while (retValue.match(reg)) {
      retValue = retValue.replace(reg, "");
    }

    /* 二重で絵文字チェック（4バイト、サロゲートペアの残りカス除外）*/
    return retValue.split("").reduce((p, c) => {
      const code = c.charCodeAt(0);
      if (
        encodeURIComponent(c).replace(/%../g, "x").length < 4 &&
        !surrogatePairCode.some((codeNum) => code == codeNum)
      ) {
        return (p += c);
      } else {
        return p;
      }
    }, "");
  };

  /* 「結構です」が出てたら押す */
  const nothanks = document.getElementByXPath('//*[text()="結構です"]');
  if (nothanks) {nothanks.click();}

  /* プロフィール詳細を開く */
  document.getElementByXPath('//span[text()="プロフィールを開く"]').click();
  await sleep(1000);

  /* 名前等の情報取得 */
  let profileText = document.getElementByXPath('//hr[contains(@class, "divider-primary")][1]/following-sibling::div[1]');
  let name = document.getElementByXPath('//h1');
  let age = document.getElementByXPath('//span[contains(@aria-label, "歳")]');
  let distance = document.getElementByXPath('//div[contains(text(), "km")]');
  if (profileText) {
    profileText = profileText.textContent; /* プロフィール詳細文字列の前処理 */
    profileText = profileText.replaceAll("\n", "");
    profileText = removeEmoji(profileText);
  }
  if (name) {name = name.textContent;}
  if (age) {age = age.textContent;}
  if (distance) {distance = distance.textContent;}
  document.getElementByXPath('//span[text()="戻る"]/..').click();
  await sleep(1000);

  /*  プロフィール詳細文字列の英文判定 */
  const likeElem = document.getElementByXPath('(//*[text()="Like"]/../../..)[2]');
  const nopeElem = document.getElementByXPath('(//*[text()="Nope"]/../../..)[2]');
  const regEnglish = /^[0-9\s\t\w“”!"#\$%&'’\(\)\*\+,-\./\:;<\=>\?\[\]\^`\{\|\}~]+$/;
  let result = '';
  if (regEnglish.test(profileText)) {
    nopeElem.click();
    result = 'nope';
  } else {
    likeElem.click();
    result = 'like';
  }

  /* 結果の表示 */
  console.log('Name: ' + name);
  console.log('Age: ' + age);
  console.log('Distance: ' + distance);
  console.log('ProfileText: ' + profileText);
  console.log('Result: ' + result);
  console.log('\n');

}, 10e3);
