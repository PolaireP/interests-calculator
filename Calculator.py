
class InterestCalculator():

    def __init__(self, money, interests, years, periodType = 0) -> None:
        """Initialisation of the calculator

        Args:
            money (float|int): The money that the bank will give
            interests (int): Percentage of interests (if 12% entenr 12)
            years (int): the number of times to pay
            periodType (int) : 0 for years, 1 for months, 2 for semesters, 3 for trimesters
        """
        self.money = money
        self.interests = interests
        self.actualPeriod = periodType
        self.periods = {
            "years": years,
            "months": years*12,
            "semesters": years*2,
            "trimesters": years*3
        }

    def set_periods(self, years):
        """Compute the number of periods with a new year parameter
        """

        self.periods = {
            "years": years,
            "months": years*12,
            "semesters": years*2,
            "trimesters": years*3
        }

    def get_money(self):
        return self.money

    def set_money(self, value):
        self.money = value

    def get_interests(self):
        return self.interests

    def set_interests(self, value):
        self.interests = value

    def get_periods(self):
        return self.periods

    def set_periods(self, value):
        self.periods = value

    def get_periods(self):
        return self.periods


    
        