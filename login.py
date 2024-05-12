"""cookies.pklを使用してtinderにログインする"""

import pickle
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

options = Options()
options.add_argument('--lang=ja-JP')
driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )

driver.get('https://tinder.com')
cookies_path = Path('cookies.pkl')
if cookies_path.exists():
    cookies = pickle.load(open(cookies_path, 'rb'))
    for cookie in cookies:
        driver.add_cookie(cookie)
    print(cookies_path, 'を読み込みました')
driver.get('https://tinder.com')
# ここで待機処理を入れる。待機処理している間に立ち上がっているブラウザでログイン処理する。
_ = input('ブラウザ上でtinderを操作してください。終了したければ何かキーを押してください。')
