# ICQbackup2024 v 0.0.0.0
ICQ web chat history backup tool

# The Why
2024.06.24 the current owner of the ICQ messenger turns off the service forever after decades of online presence. No ways to export chat history or contacts were provided by the owner, hence I decided to fix this oversight on their part.

# The Who
This extension is tested in Google Chrome, but should work in any versions of Firefox after they adopted WebExtensions standard.

# The How
This extension works by monkey-patching original webpacked javascript file served by web.icq.com. It clones the original messages into a custom "History" window so that they can be downloaded as an .mhtml file and also captures them in json format. Files and Contacts exports are planned to be added later.

# The Where
This extension is going to be available at Google Webstore and probably Mozilla as well if it's going to be approved fast enough. Otherwise users will have to install the unpacked version in developer mode.
