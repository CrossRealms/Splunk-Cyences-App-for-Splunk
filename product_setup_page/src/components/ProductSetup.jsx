import React, { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Switch from '@splunk/react-ui/Switch'
import DataMacroConfiguration from './DataMacroConfiguration';
import Heading from '@splunk/react-ui/Heading';
import SearchTable from './SearchTable';
import { generateToast } from '../utils/util';
import { saveProductConfig } from '../utils/api';
import '../css/spinner.css'


function effectiveEnabled(enabled) {
  if (enabled.toString().toLowerCase() === "unknown") {
    return [false, "Unknown"];
  } else {
    return [enabled, enabled ? "Enabled" : "Disabled"];
  }
}

export default function ProductSetup(props) {
  const { productInfo } = props;
  const [enabled, setEnabled] = useState(productInfo.enabled)
  const [macros, setMacros] = useState(productInfo.macro_configurations)
  const [response, setResponse] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  function changeEnabled() {
    const [finalEnabled, enabledLabel] = effectiveEnabled(enabled);

    const payload = {
      product: productInfo.name,
      enabled: !finalEnabled,
    }
    saveProductConfig(payload)
      .then((resp) => {
        generateToast(`Successfully ${!finalEnabled ? 'enabled' : 'disabled'} "${payload.product}".`, "success")
        setEnabled(!finalEnabled);
        setResponse(resp.data.entry[0].content.message);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        generateToast(`Failed to update "${payload.product}". error=${error}`, "error")
        setIsLoading(false);
      });
    setIsLoading(true);
  }

  function updateMacroDefinition(macro, definition) {
    const updatedMacros = macros.map((item) => {
      if (macro === item.macro_name) {
        return { ...item, macro_definition: definition };
      }
      return item;
    });
    setMacros(updatedMacros);
  }

  function saveMacros() {
    const payload = {
      product: productInfo.name,
      macro_configurations: macros
    }
    saveProductConfig(payload)
      .then((resp) => {
        generateToast(`Successfully updated "${payload.product}" macros.`, "success")
      })
      .catch((error) => {
        console.log(error);
        generateToast(`Failed to update "${payload.product}" macros. error=${error}`, "error")
      })
  }

  const [finalEnabled, enabledLabel] = effectiveEnabled(enabled);

  return (
    <div style={{ 'marginLeft': '25px' }} >
      <h1 style={{marginBottom:'0px'}}>{productInfo.label ? productInfo.label : productInfo.name}</h1>
      <Switch inline key={productInfo.name} value={productInfo.name} selected={finalEnabled} appearance="toggle" onClick={changeEnabled}>
        {enabledLabel}
      </Switch>

      {macros?.map((item) => (
        <DataMacroConfiguration
          key={item.macro_name}
          macroName={item.macro_name}
          macroLabel={item.label}
          macroDefinition={item.macro_definition}
          defaultSearch={item.search}
          earliestTime={item.earliest_time}
          latestTime={item.latest_time}
          updateMacroDefinition={updateMacroDefinition}
        />
      ))}
      <Button label="Save" appearance="primary" onClick={saveMacros} updateMacroDefinition={updateMacroDefinition} />
      {response && <pre>{response}</pre>}
      {isLoading ? <div id="spinner"></div>: null}

       { productInfo.app_dependency_search === '' ? null : <><Heading>App Dependencies</Heading><SearchTable searchQuery={productInfo.app_dependency_search} /></> }
    </div>
  );
}
