# ICQbackup2024 v 1.3.3.7
ICQ history backup tool (web.icq.com)

# The Why
2024.06.26 the current owner of the ICQ messenger turns off the service forever after decades of online presence. No ways to export chat history or contacts were provided by the owner, hence I decided to fix this oversight on their part.

# The Who
This extension is only tested in Google Chrome, but should work in any versions of Firefox after they adopted WebExtensions standard.

# The How
This extension works by monkey-patching original webpacked javascript file served by web.icq.com. It clones the original messages into a custom "History" window so that they can be downloaded as an .mhtml file and also captures them in json format. Files are downloaded on the go (optionally).

# The Where
This extension is going to be available at Google Webstore if it's going to be approved fast enough. Otherwise users will have to install the unpacked version in developer mode.
