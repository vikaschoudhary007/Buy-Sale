pragma solidity ^0.6.6;

contract createCart {
    
    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchaseStatus;
    }
    
    uint public productCount = 0;
    mapping(uint => Product) public products;
    
    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchaseStatus    
    );
    
    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchaseStatus    
    );
    
    function createProduct(string memory _name, uint _price) public {
        
        require(bytes(_name).length > 0,"Please enter a valid name");
        require(_price > 0, "Please enter a valid price");
        
        productCount++;

        emit ProductCreated(productCount, _name, _price, msg.sender, false);

        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        
       
    }
    
    function purchaseProduct(uint _id) public payable {
        
        Product memory _product = products[_id];
        address payable _seller = _product.owner;
        
        require(_product.id > 0 && _product.id <= productCount, "Invalid product id");
        require(msg.value >= _product.price, "Invalid amount");
        require(_seller != msg.sender, "You are not authorized to buy this product");
        require(!_product.purchaseStatus,"Product is not available");
        
        _product.owner = msg.sender;
        _product.purchaseStatus = true;
        
        products[_id] = _product;
        _seller.transfer(msg.value);
        emit ProductPurchased(_id, products[_id].name, products[_id].price, msg.sender, true);

    }
    
}