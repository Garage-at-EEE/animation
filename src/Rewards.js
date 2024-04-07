import React from 'react';

function Product({ image, points }) {
    return (
        <div style={{ padding: '10px', textAlign: 'center', display:'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={image} alt="" style={{ width: '100%', height: 'auto' }} />
            </div>
            <div style={{ paddingTop: '10px' }}>
                <p className="points-text">{points} points</p> {/* Add a class here */}
            </div>
        </div>
    );
}


// Define the ProductGrid component
function ProductGrid({ products }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {products.map(product => (
                <Product key={product.id} image={product.image} points={product.points} />
            ))}
        </div>
    );
}

// Rewards component that uses ProductGrid
const Rewards = () => {
    const products = [
        { id: 1, image: 'https://static.cytron.io/image/cache/catalog/products/ARDUINO-UNO/ARDUINO-UNO%20(a)-800x800.jpg', points: 10.00 },
        { id: 2, image: 'https://m.media-amazon.com/images/I/61QTlWRmRCL._AC_SL1000_.jpg', points: 15.00 },
        { id: 3, image: 'https://static.cytron.io/image/cache/catalog/products/ARDUINO-UNO/ARDUINO-UNO%20(a)-800x800.jpg', points: 10.00 },
        { id: 4, image: 'https://m.media-amazon.com/images/I/61QTlWRmRCL._AC_SL1000_.jpg', points: 15.00 },
        { id: 5, image: 'https://static.cytron.io/image/cache/catalog/products/ARDUINO-UNO/ARDUINO-UNO%20(a)-800x800.jpg', points: 10.00 },
        { id: 6, image: 'https://m.media-amazon.com/images/I/61QTlWRmRCL._AC_SL1000_.jpg', points: 15.00 },
        { id: 7, image: 'https://static.cytron.io/image/cache/catalog/products/ARDUINO-UNO/ARDUINO-UNO%20(a)-800x800.jpg', points: 10.00 },
        { id: 8, image: 'https://m.media-amazon.com/images/I/61QTlWRmRCL._AC_SL1000_.jpg', points: 15.00 },
        // Add more products as needed
    ];

    return (
        <div>
            <h1 style={{color:'white', fontSize:'3.0rem'}}>Rewards Catalog</h1>
            <ProductGrid products={products} />
        </div>
    );
};

export default Rewards;


