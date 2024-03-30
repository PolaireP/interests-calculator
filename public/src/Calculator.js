import Decimal from "./decimal.js/decimal.mjs";

export class Calculator {
  constructor() {
    this.money = null;
    this.time = null;
    this.period = 'Y';
    this.taux = null;
  }

  round(val) {
    return new Decimal(val).toDecimalPlaces(2);
  }

  get tauxMult() {
    return this.taux.times(0.01);
  }

  get state() {
    /**
     * @returns {boolean} True if the calculator is initiated with non null values, else False
     */
    if ([this.money, this.taux, this.period, this.time].includes(null)) {
      return false;
    } else {
      return true;
    }
  }

  setInfos(money = null, taux = null, period = null, time = null) {
    this.money = money ? new Decimal(money) : this.money;
    this.taux = taux ? new Decimal(taux) : this.taux;
    this.period = period ? period : this.period;
    this.time = time ? new Decimal(time) : this.time;
  }

  get tauxMensuel() {
    // on fera la vérification de si c'est mois ou trimestre

    // taux sur le mois
    return this.tauxMult.add(1).pow(Decimal(1).dividedBy(12)).sub(1);
  }

  get tauxTrim() {
    // on fera la vérification de si c'est mois ou trimestre

    // taux sur le Trimestre
    return this.tauxMult.add(1).pow(Decimal(1).dividedBy(4)).sub(1);
  }

  get tauxSem() {
    // on fera la vérification de si c'est mois ou trimestre

    // taux sur le Semestre
    return this.tauxMult.add(1).pow(Decimal(1).dividedBy(2)).sub(1);
  }

  getAnuite(money = this.money, time = this.time) {
    return Decimal(money).mul(
      this.tauxMult.dividedBy(
        Decimal(1).sub(Decimal(this.tauxMult.add(1)).pow(-time))
      )
    );
  }

  getMensuialite(money = this.money, time = this.time) {
    let taux = this.tauxMensuel;
    return Decimal(money).mul(
      Decimal(
        Decimal(taux).dividedBy(
          Decimal(1).sub(
            Decimal(
              Decimal(Decimal(1).add(taux)).pow(
                Decimal(Decimal(-time).mul(Decimal(12)))
              )
            )
          )
        )
      )
    );
  }

  getTrimesuialite(money = this.money, time = this.time) {
    let taux = this.tauxTrim;
    return Decimal(money).mul(
      Decimal(
        Decimal(taux).dividedBy(
          Decimal(1).sub(
            Decimal(
              Decimal(Decimal(1).add(taux)).pow(
                Decimal(Decimal(-time).mul(Decimal(4)))
              )
            )
          )
        )
      )
    );
  }

  getSemestrualité(money = this.money, time = this.time) {
    let taux = this.tauxSem;
    return Decimal(money).mul(
      Decimal(
        Decimal(taux).dividedBy(
          Decimal(1).sub(
            Decimal(
              Decimal(Decimal(1).add(taux)).pow(
                Decimal(Decimal(-time).mul(Decimal(2)))
              )
            )
          )
        )
      )
    );
  }

  getAmmort(periodCalculator, capital, taux) {
    return periodCalculator.sub(capital.mul(taux))
  }

  getCapRest(capital, amort) {
    return capital.sub(amort)
  }

  computeOneInterest(year = 1, capital = this.money) {
    let amort = this.getAmmort(this.getAnuite(), capital, this.tauxMult);


    return {
      year: year,
      capital: capital.toFixed(),
      interest: capital.mul(this.tauxMult).toFixed(),
      amort_capital: amort.toFixed(),
      ann_demp: this.getAnuite().toFixed(),
      cap_rest: this.getCapRest(capital, amort).toFixed(),
    };
  }

  computeOneTrimInterest(year = 1, capital = this.money) {
    let amort = this.getAmmort(this.getTrimesuialite(), capital, this.tauxTrim);

    return {
      year: year,
      capital: capital.toFixed(),
      interest: capital.mul(this.tauxTrim).toFixed(),
      amort_capital: amort.toFixed(),
      ann_demp: this.getTrimesuialite().toFixed(),
      cap_rest: this.getCapRest(capital, amort).toFixed(),
    };
  }

  computeOneMensInterest(year = 1, capital = this.money) {
    let amort = this.getAmmort(this.getMensuialite(), capital, this.tauxMensuel);

    return {
      year: year,
      capital: capital.toFixed(),
      interest: capital.mul(this.tauxTrim).toFixed(),
      amort_capital: amort.toFixed(),
      ann_demp: this.getMensuialite().toFixed(),
      cap_rest: this.getCapRest(capital, amort).toFixed(),
    };
  }

  computeOneSemInterest(year = 1, capital = this.money) {
    let amort = this.getAmmort(this.getSemestrualité(), capital, this.tauxSem);

    return {
      year: year,
      capital: capital.toFixed(),
      interest: capital.mul(this.tauxSem).toFixed(),
      amort_capital: amort.toFixed(),
      ann_demp: this.getSemestrualité().toFixed(),
      cap_rest: this.getCapRest(capital, amort).toFixed(),
    };
  }



  computeInterests() {
    // Récupération des multiplicateurs
    const multipliers = { S: 2, M: 12, Y: 1, T: 4 };

    let tableau = [];

    let nbIter = this.time * multipliers[this.period];
    let evolvingCap = this.money;

    switch (this.period) {
      case "T":
        for (let index = 1; index <= nbIter; index++) {
          tableau.push(this.computeOneTrimInterest(index, evolvingCap));

          evolvingCap = new Decimal(this.computeOneTrimInterest(index, evolvingCap)["cap_rest"]);
        }

        break;

      case "Y":
        for (let index = 1; index <= nbIter; index++) {
          tableau.push(this.computeOneInterest(index, evolvingCap));

          evolvingCap = new Decimal(this.computeOneInterest(index, evolvingCap)["cap_rest"]);
        }

        break;

      case "M":
        for (let index = 1; index <= nbIter; index++) {
          tableau.push(this.computeOneMensInterest(index, evolvingCap));

          evolvingCap = new Decimal(this.computeOneMensInterest(index, evolvingCap)["cap_rest"]);
        }

        break;

      case "S":
        for (let index = 1; index <= nbIter; index++) {
          tableau.push(this.computeOneSemInterest(index, evolvingCap));

          evolvingCap = new Decimal(this.computeOneSemInterest(index, evolvingCap)["cap_rest"]);
        }

        break;
      default:
        break;
    }

    return tableau;
  }

  getTotal(table) {
    let totalInterets = Decimal(0);
    let totalAmort = Decimal(0);
    let totalAnnDemp = Decimal(0)
    table.forEach(element => {
      totalInterets = totalInterets.add(element.interest)
      totalAmort = totalAmort.add(element.amort_capital)
      totalAnnDemp = totalAnnDemp.add(element.ann_demp)
    })

    return {
      totalInterets : totalInterets.toDP(2).toFixed(),
      totalAmort : totalAmort.toDP(2).toFixed(),
      totalAnnDemp : totalAnnDemp.toDP(2).toFixed()
    }
  }


  transformTable() {
    let table = this.computeInterests();
    table.forEach(element => {
      element.capital = Decimal(element.capital).toDP(2).toFixed()
      element.interest = Decimal(element.interest).toDP(2).toFixed()
      element.amort_capital = Decimal(element.amort_capital).toDP(2).toFixed()
      element.ann_demp = Decimal(element.ann_demp).toDP(2).toFixed()
      element.cap_rest = Decimal(element.cap_rest).toDP(2).toFixed()
    });

    return table;
  }
}