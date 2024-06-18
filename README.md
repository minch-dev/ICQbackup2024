# ICQbackup2024 v 1.9.8.4
ICQ history backup tool (web.icq.com). Added base64 avatars of contacts, now it also asks each time you refresh or open the page if you want to autodownload files or not. Probably final fix, as time is running out and I have some serious issues IRL right now. Have a nice day!

Инструмент сохранения истории, файлов, и контактов с web.icq.com. Добавлено сохранение аватаров для контактов. Теперь спрашивает при каждом открытии или перезагрузке страницы нужна ли вам автозагрузка файлов или нет. Последний фикс, времени до 26 числа немного, реальная жизнь подкинула больших проблем, так что мне совсем не до расширений. Удачи!

# Chrome Web Store
The extension was published really fast, I didn't expect that! Let's hope it's going to be updated as fast as it was approved!
https://chromewebstore.google.com/detail/icq-backup-2024/dppnmfiofjbcdnimpbbbpdjabihmjpef
Расширение опубликовано в магазине расширений хрома! Правда там версия без последнего фикса, но будем надеятся, что она обновится так же быстро, как проверилась.

# Installation
Download source as zip file, unpack, in chrome extensions turn on `Developer mode` switch and click `Load unpacked extension`.

# Установка
Скачать исходный код как zip папку, распакуйте, зайдите в управление расширениями, включите `Режим разработчика` и нажмите `Загрузить распакованное расширение`.

# The Why
2024.06.26 the current owner of the ICQ messenger turns off the service forever after decades of online presence. No ways to export chat history or contacts were provided by the owner, hence I decided to fix this oversight on their part.

# The Who
This extension is only tested in Google Chrome, but should work in any versions of Firefox after they adopted WebExtensions standard.

# The How
This extension works by monkey-patching original webpacked javascript file served by web.icq.com. It clones the original messages into a custom "History" window so that they can be downloaded as an .mhtml file and also captures them in json format. Files are downloaded on the go (optionally). This extension also saves base64 avatars for contact list now.

# The Where
This extension is going to be available at Google Webstore if it's going to be approved fast enough. Otherwise users will have to install the unpacked version in developer mode.
