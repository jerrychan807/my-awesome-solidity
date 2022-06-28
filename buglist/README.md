

字符串传参

```
TypeError: Data location must be "memory" or "calldata" for return parameter in function, but none was given.
  --> interfaces/simple-interface/ILogic.sol:20:45:
   |
20 |     function getLastName() external returns(string);
```

字符串无法作为函数参数传参，可以选择用定长数组`bytesX`

