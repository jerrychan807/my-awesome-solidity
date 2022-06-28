# etherjs使用记录


# 

## 获取无view函数的返回值

```js
// 合约里的没有用view声明的函数，有返回值
function getFirstName() external returns (bytes32){
    return satteliteContract.getFirstName();
}
```

```js
// 调用方法 + callStatic
let firstNameBytes32 = await Owner.MainContract.callStatic.getFirstName();
```


## bytes <=> string

```js
let firstNameText = "Hello";
let lastNameText = "Jerry";

let firstNameBytes = ethers.utils.formatBytes32String(firstNameText);
let lastNameBytes = ethers.utils.formatBytes32String(lastNameText);

let firstNameBytes32 = await Owner.MainContract.callStatic.getFirstName();
let lastNameBytes32 = await Owner.MainContract.callStatic.getLastName();

console.log('firstName: ' + ethers.utils.parseBytes32String(firstNameBytes32));
console.log('lastName: ' + ethers.utils.parseBytes32String(lastNameBytes32));

```