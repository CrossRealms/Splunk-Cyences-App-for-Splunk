import React, { useState } from 'react';
import Button from '@splunk/react-ui/Button';
import Switch from '@splunk/react-ui/Switch'
import MacroConfiguration from './MacroConfiguration';
import { generateToast } from '../utils/util';
import { saveProductConfig } from '../utils/api';


export default function ProductSetup(props) {
  const { productInfo } = props;
  const [enabled, setEnabled] = useState(productInfo.enabled)
  const [macros, setMacros] = useState(productInfo.macro_configurations)


  function changeEnabled() {

    const payload = {
      product: productInfo.name,
      enabled: !enabled,
    }
    saveProductConfig(payload)
      .then((resp) => {
        generateToast(`Successfully updated "${payload.product}".`, "success")
        setEnabled(!enabled);
      })
      .catch((error) => {
        console.log(error);
        generateToast(`Failed updated "${payload.product}". check console for more detail.`, "error")
      })
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
        generateToast(`Failed updated "${payload.product}" macros. check console for more detail.`, "error")
      })
  }


  return (
    <div style={{ 'marginLeft': '25px' }} >
      <h1>{productInfo.name}
        <Switch key={productInfo.name} value={productInfo.name} selected={enabled} appearance="toggle" onClick={changeEnabled}>
          {enabled ? "Enabled" : "Disabled"}
        </Switch>
      </h1>
      {macros?.map((item) => (
        <MacroConfiguration
          key={item.macro_name}
          macroName={item.macro_name}
          macroDefinition={item.macro_definition}
          defaultSearch={item.search}
          earliestTime={item.earliest_time}
          latestTime={item.latest_time}
          updateMacroDefinition={updateMacroDefinition}
        />
      ))}
      <Button label="Save" appearance="primary" onClick={saveMacros} updateMacroDefinition={updateMacroDefinition} />
    </div>
  );
}
