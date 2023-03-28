import React, { useEffect, useState, useCallback } from 'react';
import NavBar from './components/NavBar';
import ProductSetup from './components/ProductSetup';
import { fetchProducts } from './utils/api';


export default function App() {
    const [products, setProducts] = useState(null);
    const [activeTabId, setActiveTabId] = useState('');

    const handleChange = useCallback((e, { selectedTabId }) => {
        setActiveTabId(selectedTabId);
    }, []);


    useEffect(() => {
        fetchProducts()
            .then((resp) => {
                const data = JSON.parse(resp.data.entry[0].content.products);
                setProducts(data);
                setActiveTabId(data[0].name)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    if (!products) {
        return <div>Loading...</div>
    }

    return (
        <div style={{ display: 'flex' }}>
            <NavBar activeTabId={activeTabId} handleChange={handleChange} items={products?.map((productInfo) => productInfo.name)} />
            {
                products?.map((productInfo) => (
                    <div key={productInfo.name} style={{ display: activeTabId === productInfo.name ? 'block' : 'none' }}>
                        <ProductSetup key={productInfo.name} productInfo={productInfo} />
                    </div>
                ))
            }
        </div>
    );
}