# Cyences App for Splunk
Cyences App for Splunk built by CrossRealms International


### Feedback
To provide the feedback open issue in this repo.


## Development
To contribute to the project, please raise PR against this repo.

#### About this project
This project is to build a Splunk App that allows user to visualize the security of the whole corporate environment at the central place. 

#### How this App is different from Enterprise Security?
- For enterprise security user has to configure the Enterprise Security's correlation searches and understand how Enterprise Security works. 
- But for this App, the goal is to provide out of the box end-to-end security solutions. So, user don't have to configure much. Also, this App works on the alerts so that user can get slack or email notification while keeping the minimal false positives.

#### Owner of the Repo
Development has started under the observation of `CrossRealms International`. But the goal is to make it collaborative development.



## Documentation
Cyences Documentation is powered by Jekyll and is present under doc directory.

References:
* https://pmarsceill.github.io/just-the-docs/
* https://github.com/pmarsceill/just-the-docs

#### Local Installation of Jekyll
* Install Jekyll (along with dependencies Ruby)
  * https://jekyllrb.com/docs/installation/
* gem install just-the-docs
* gem install webrick
* Temporary update the _config.yml file to enable the local version of just-the-doc.
  * Uncomment the theme attribute and comment the remote_theme attribute.
* Serve the doc locally:
  * jekyll serve -s <Repo-Dir>\Splunk-Cyences-App-for-Splunk\docs -d <Repo-Dir>\Splunk-Cyences-App-for-Splunk\_site
* Go to: http://127.0.0.1:4000


#### ReadMe Files
Please read App's documentation [here](cyences_app_for_splunk/ReadMe.md).
Please read Add-on's documentation [here](TA-cyences/ReadMe.md).
