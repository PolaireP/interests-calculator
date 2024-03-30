console.log('Loaded !')
import { Calculator } from "./Calculator.js";

export class UI{
    constructor(data = null, total = null,  period = null) {
        this.button = document.getElementById('calculate-btn');
        this.result = document.getElementById('result');
        this.table = document.createElement('table')
        this.isShown = false

        this.period = period
        this.data = data
        this.total = total

        this.error = document.createElement('p')
        this.error.className = 'error'
        this.error.innerHTML = "Erreur, merci d'entrée des données valides"


        this.Calculator = new Calculator()

        this.button.onclick = () => {this.changeState()}
    }

    clear() {
        this.table.innerHTML = "";
        this.result.innerHTML = "";
        this.result.style = 'visibility: hidden;'
    }

    addToTable(elem) {
        this.table.appendChild(elem)
    }

    decode_period(period) {
        switch (period) {
            case 'Y':
                return 'Année';
            
            case 'T' : 
                return 'Trimestre';
            
            case 'M' : 
                return 'Mois';
            
            case 'S' :
                return 'Semestre';
        
            default:
                break;
        }
    }

    createTableHeader(period) {
        let thead = document.createElement('thead')
        let line = document.createElement('tr')

        // Elements des lignes retournées par Calculator
        let year = document.createElement('th')
        let capital = document.createElement('th')
        let interest = document.createElement('th')
        let amort_capital = document.createElement('th')
        let ann_demp = document.createElement('th')
        let cap_rest = document.createElement('th')

        // Remplissage des lignes

        year.scope = 'col'
        year.innerHTML = this.decode_period(period)

        capital.scope = 'col'
        capital.innerHTML = 'Capital restant dû en début de période'

        interest.scope = 'col'
        interest.innerHTML = 'Intérêts de la période'

        amort_capital.scope = 'col'
        amort_capital.innerHTML = 'Amortissement du capital'

        ann_demp.scope = 'col'
        ann_demp.innerHTML = "Annuité d'emprunt"

        cap_rest.scope = 'col'
        cap_rest.innerHTML = 'Capital restant dû en fin de période'


        // Ajout

        line.appendChild(year)
        line.appendChild(capital)
        line.appendChild(interest)
        line.appendChild(amort_capital)
        line.appendChild(ann_demp)
        line.appendChild(cap_rest)

        thead.appendChild(line)

        return thead
    }

    createTableLine(data) {

        let line = document.createElement('tr')

        // Elements des lignes retournées par Calculator
        let year = document.createElement('th')
        let capital = document.createElement('th')
        let interest = document.createElement('th')
        let amort_capital = document.createElement('th')
        let ann_demp = document.createElement('th')
        let cap_rest = document.createElement('th')

        // Remplissage des lignes

        year.scope = 'col'
        year.innerHTML = data.year

        capital.scope = 'col'
        capital.innerHTML = data.capital

        interest.scope = 'col'
        interest.innerHTML = data.interest

        amort_capital.scope = 'col'
        amort_capital.innerHTML = data.amort_capital

        ann_demp.scope = 'col'
        ann_demp.innerHTML = data.ann_demp

        cap_rest.scope = 'col'
        cap_rest.innerHTML = data.cap_rest


        // Ajout

        line.appendChild(year)
        line.appendChild(capital)
        line.appendChild(interest)
        line.appendChild(amort_capital)
        line.appendChild(ann_demp)
        line.appendChild(cap_rest)

        return line
    }

    createTableFooter(data) {
        let tfoot = document.createElement('tfoot')

        let line = document.createElement('tr')

        // Elements des lignes retournées par Calculator
        let year = document.createElement('th')
        let capital = document.createElement('th')
        let interest = document.createElement('th')
        let amort_capital = document.createElement('th')
        let ann_demp = document.createElement('th')
        let cap_rest = document.createElement('th')

        // Remplissage des lignes

        year.scope = 'col'
        year.innerHTML = 'Totaux'

        capital.scope = 'col'

        interest.scope = 'col'
        interest.innerHTML = data.totalInterets

        amort_capital.scope = 'col'
        amort_capital.innerHTML = data.totalAmort

        ann_demp.scope = 'col'
        ann_demp.innerHTML = data.totalAnnDemp

        cap_rest.scope = 'col'


        // Ajout

        line.appendChild(year)
        line.appendChild(capital)
        line.appendChild(interest)
        line.appendChild(amort_capital)
        line.appendChild(ann_demp)
        line.appendChild(cap_rest)

        tfoot.appendChild(line)

        return tfoot
    }

    showTable() {

        this.addToTable(this.createTableHeader(this.Calculator.period))

        let body = document.createElement('tbody');

        this.Calculator.transformTable().forEach(
            data => {
                body.appendChild(this.createTableLine(data))
            }
        )

        this.addToTable(body)

        this.addToTable(this.createTableFooter(this.Calculator.getTotal(this.Calculator.computeInterests())))


        this.result.appendChild(this.table)
        this.result.style = 'visibility: visible;'
    }

    setContent() {
        let money = document.getElementById('money').value;
        let time = document.getElementById('time').value;
        let taux = document.getElementById('taux').value;
        let period = document.querySelector('input[name="period"]:checked').value;

    

        if ([money, time, taux].includes("")) {
            return false
        } else {
            console.log('test')
            this.Calculator.setInfos(money, taux, period, parseInt(time))
            console.log(this.Calculator)
            return true
        }
        
    }

    showError() {
        this.result.appendChild(this.error)
        this.result.style = 'visibility: visible;'
    }

    changeState() {
        if (this.setContent()) {
            this.clear()
            this.showTable()
        } else {
            this.clear()
            this.showError()
        }
    }
}