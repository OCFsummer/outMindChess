from bs4 import  BeautifulSoup
import urllib.request
import os

url='http://fight.pcgames.com.cn/276/2764885.html';
html=urllib.request.urlopen(url).read();

soup = BeautifulSoup(html);

imgs = soup.find_all('img');

# print(imgs);


def save_img(img_url,file_name,file_path=r'D:\zhangxuan\私人娱乐项目\breakMindChess\imgs'):
    #保存图片到磁盘文件夹 file_path中，默认为当前脚本运行目录下的 book\img文件夹
    try:
        # if not os.path.exists(file_path):
        #     print '文件夹',file_path,'不存在，重新建立'
        #     #os.mkdir(file_path)
        #     os.makedirs(file_path)
        #获得图片后缀
        file_suffix = os.path.splitext(img_url)[1]
        #拼接图片名（包含路径）
        filename = '{}{}{}{}'.format(file_path,os.sep,file_name,file_suffix)
       #下载图片，并保存到文件夹中
        urllib.request.urlretrieve(img_url,filename=filename)
    except IOError as e:
        print ('文件操作失败',e)
    except Exception as e:
        print ('错误 ：',e)

# list = ["../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSzoeoUdYkJjJH9J@AD2vb9w=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS@K6pIRFUDlSLXrF2_tCxKI=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS1NMZUS3ef6JGJpTpLOIGyc=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS4aNrySg3W_ZE1uY@SN2pvE=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS8qk3RbpChVh0itGqsHiKvU=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSxi9z7_FkXFedtkenLCjaJw=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS6xTtQVhHQ5T2YWaj5DBFZ8=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS@eZkGO4Pvhi@x_ea0fDYl0=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS0S8iS5xet0GiR@ZtPTzeTw=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS2cVerVJT6oS_nB4oma9mgI=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS7khvWBPigUAR4j2iaIpwtE=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS0NGnlSkv9V90atYqRri8bU=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS6duGV3dn9fLby3oIikx23o=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS2BIB73du0gAF1_4XJVc4ZI=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS@UGGOiMEdFrLvagShIIwSg=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSzA6Vurd_3Mp5veEvuFze3U=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS93CTt40Ol_3OfI6dMombNc=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSxZjApxv6Xv83osTqtiRUXo=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS_aPCT4eyOSMYf9xVXQvCUM=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS2sUYffGw7EdYCktH4zjcdk=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSxTPA9@btT0NipJ3hEQOJYs=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS61iI82dEA683n8pOUttN7o=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSw6YHVT70Qj4RLm_a15C5Cs=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS_m9nxzf1JTRBelfnY2qMKc=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS3UxQDmo2iOOl_7MS@D5tLg=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS7aujpGQQyMMah_8vIwL6R0=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS3WoKmeEGVXrP66QmYB6WsE=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS5mLQPe@ewcs@I_Z0nIRz0I=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS6bh68A@S6dBcUwRXlXkbTo=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS8BvaC1KCmpYuVqz@fcL09A=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddSwZqSpQ8AFZrPjEHcjszV2g=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS2lDCXA47ZG0@QbswCShiMo=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS2FAequvOjTSAF6BQTclPA0=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS5auEwXdDK792bap@W8wGEM=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS1b41KL6Fft_4DRB7b@JKXg=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS9qKVY9QHi3iXKKObOLwLs0=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS3vS4hZNgYdA5bEtbaKWP8k=", "../img/?img=Hs92T42xAvu6r7iiSA1XpYyWVywogJVw@J7zd_9_NEwNwPHfXqddS22yxDStP@_QjtG8jzQrkIo="]

for i, x in enumerate(imgs):
    #print(imgs[i]['src'], imgs[i]['title']+'.png');
	#save_img(imgs[i]['src'], imgs[i]['title']);
    print(imgs[i]);

#print(list)



		



