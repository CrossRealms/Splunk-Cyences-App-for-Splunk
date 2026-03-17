#  Configuration and Alert (Vite + React + MUI)

A modern frontend project built with **React 19**, **Vite**, **MUI**, **Tailwind CSS**, and **Splunk UI libraries**.

This project includes multiple build targets for different modules like **Alert** and **Configuration**.

---

## Tech Stack

*  React 19
*  Vite 7
*  MUI (Material UI)
*  Tailwind CSS
*  Splunk React UI
*  Axios

---

## Project Setup

### 1. Install Dependencies

```bash
`cd custom_alert`
npm install --force
```

---

## Link js files with splunk
  * Make sure splunk path is correct and cyences app is already installed in the splunk
  * The below command will create a soft link. To delete soft link use: `unlink /opt/splunk/etc/apps/cyences_app_for_splunk/appserver/static/js` command
`ln -s $PWD/../cyences_app_for_splunk/appserver/static/js /opt/splunk/etc/apps/cyences_app_for_splunk/appserver/static/js`
* Restart Splunk once.
* Start dev server to monitor for changes and generate minified js files

##  Development

## Important
* Make sure you do _bump on every change to reflect changes in the splunk environment.
* If you are on development server then you can create a /opt/splunk/etc/system/local/web.conf file with below content.
```
[settings]
cacheEntriesLimit = 0
cacheBytesLimit = 0
```

## Build Commands

### Build Alert Module

```bash
npm run build:alert
```

* Uses: `vite.alert.config.js`
* Builds only the **Alert module**

---

### Build Configuration Module

```bash
npm run build:configuration
```

* Uses: `vite.setup.config.js`
* Builds only the **Configuration module**

---

### Build All Modules

```bash
npm run build:all
```

* Runs both builds sequentially:

  1. Alert build
  2. Configuration build

---

## Linting

```bash
npm run lint
```

* Runs ESLint on the project
* Helps maintain code quality

---

## Folder Structure (Basic)

```
├── src/
├── public/
├── vite.config.js
├── vite.alert.config.js
├── vite.setup.config.js
├── package.json
```

---

## Notes

* Ensure both build configs (`vite.alert.config.js` and `vite.setup.config.js`) are properly configured.
* `build:all` runs builds **sequentially** to avoid conflicts.
* Tailwind CSS is integrated via Vite plugin.

---

## Best Practices

* Use separate configs for modular builds (as done here)
* Keep output directories distinct if needed
* Avoid running builds in parallel unless fully independent

---
