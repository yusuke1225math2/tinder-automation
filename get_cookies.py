"""seleinum経由でtinderログインしてcookieを取得する"""
import pickle
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
# ここで待機処理を入れる。待機処理している間に立ち上がっているブラウザでログイン処理する。
_ = input('ブラウザ上でtinderにログインしてください。ログインが完了したら何かキーを押してください。')

cookies_filename = 'cookies.pkl'
cookies = driver.get_cookies()
pickle.dump(cookies, open(cookies_filename, 'wb'))
