## Setup dev environment


* `cd product_setup_page`
* Install dependencies
`yarn install`
* Link js files with splunk
  * Make sure splunk path is correct and cyences app is already installed in the splunk
  * The below command will create a soft link. To delete soft link use: `unlink /opt/splunk/etc/apps/cyences_app_for_splunk/appserver/static/js` command
`ln -s $PWD/../cyences_app_for_splunk/appserver/static/js /opt/splunk/etc/apps/cyences_app_for_splunk/appserver/static/js`
* Restart Splunk once.
* Start dev server to monitor for changes and generate minified js files
`yarn run start`


## Important
* Make sure you do _bump on every change to reflect changes in the splunk environment.
* If you are on development server then you can create a /opt/splunk/etc/system/local/web.conf file with below content.
```
[settings]
cacheEntriesLimit = 0
cacheBytesLimit = 0
```

## Final production build
* Once the development is done. Run final production build. and then commit all the changes.
`yarn run build`