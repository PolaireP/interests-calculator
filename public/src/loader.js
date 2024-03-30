import {Calculator} from './Calculator.js';
import {UI} from './Visual.js';

const calculator = new Calculator();
calculator.setInfos(100000, 12, 'Y', 5)

console.log(calculator)

let vis = new UI(calculator.getTotal(calculator.computeInterests()), null, 'Y');

console.log(vis)
console.log(calculator.state)

console.log(calculator.computeInterests())

// let th = vis.createTableHeader('Y');
// vis.showTable('Y', calculator.getTotal(calculator.computeInterests()))
// // vis.addToResult(th);
// // vis.clear();

// let isShown = false;

// export function changeState() {
//     if (isShown) {
//         vis.clear()
//     } else {
        
//     }
// }