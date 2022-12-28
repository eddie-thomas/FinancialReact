import json

from WellsFargoPdfDocument import WellsFargoPdfDocumentBaseClass


class TestClass:
    """Test Class"""

    def __init__(self):
        """Initialize the Test class. Should only be used in development."""
        self.expected = self.get_mocked_expected()

    def get_mocked_expected(self):
        """Returns mocked data"""
        return [
            {
                "date": "7/27",
                "description": "Mobile Deposit : Ref Number :511250576650",
                "deposits": "200.00",
            },
            {
                "date": "7/29",
                "description": "Paypal Transfer 150729 5S4228Y3Ptpjn American Youth Leaders",
                "deposits": "1,000.00",
            },
            {
                "date": "7/30",
                "description": "Online Transfer to American Youth Leadershi Business MarketRate Savings xxxxxx4326 Ref #Ibety26Qsc on 07/30/15",
                "withdrawals": "1,200.00",
            },
            {
                "date": "7/31",
                "description": "Purchase authorized on 07/30 Wal-Mart Check Pri 866-925-2432TX S585210857879420 Card 5799",
                "withdrawals": "14.32",
            },
            {
                "date": "7/31",
                "description": "Recurring Transfer to American Youth Leader Business MarketRate Savings Ref #Oper2Yy26P xxxxxx4326",
                "withdrawals": "25.00",
            },
            {
                "date": "8/3",
                "description": "Online Transfer From American Youth Leaders Business MarketRate Savings xxxxxx4326 Ref #Iben5Yq228 on 08/03/15",
                "deposits": "500.00",
            },
            {
                "date": "8/4",
                "description": "Purchase authorized on 08/03 Application User F 877-829-5500UT S005215653109050 Card 5799",
                "withdrawals": "400.00",
            },
            {
                "date": "8/5",
                "description": "Mobile Deposit : Ref Number :311050073507",
                "deposits": "100.00",
            },
            {
                "date": "8/7",
                "description": "Mobile Deposit : Ref Number :017070465425",
                "deposits": "60.00",
            },
            {
                "date": "8/11",
                "description": "Mobile Deposit : Ref Number :609110908697",
                "deposits": "180.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :313150527194",
                "deposits": "60.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :513150527405",
                "deposits": "60.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :213150527080",
                "deposits": "180.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :709170701020",
                "deposits": "90.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :609170700825",
                "deposits": "180.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :509170700700",
                "deposits": "270.00",
            },
            {
                "date": "8/17",
                "description": "Mobile Deposit : Ref Number :909170701246",
                "deposits": "30.00",
            },
            {
                "date": "8/18",
                "description": "Mobile Deposit : Ref Number :109180870545",
                "deposits": "270.00",
            },
            {
                "date": "8/24",
                "description": "Mobile Deposit : Ref Number :411220452573",
                "deposits": "100.00",
            },
            {
                "date": "8/24",
                "description": "Mobile Deposit : Ref Number :211220452357",
                "deposits": "180.00",
            },
            {
                "date": "8/24",
                "description": "Mobile Deposit : Ref Number :311220452470",
                "deposits": "180.00",
            },
            {
                "date": "8/25",
                "description": "Mobile Deposit : Ref Number :410250802536",
                "deposits": "180.00",
            },
        ]

    def test(self):
        """Test the test document to see if parsing it matches the expected data

        Notes:
            This test function is using mocked data. We would like to have solid, reusable PDF's that don't
            contain sensitive data to test against, but that may be hard to come by for a while.

        TODO: Reference the above note.
        """
        PDF = WellsFargoPdfDocumentBaseClass(
            "./pdfs-test/document.pdf", False, "checking"
        )
        received = json.loads(PDF.get_json())
        expected = self.expected
        if received == expected:
            print(f"\nSuccessful test ran!")


# A quick run against the test method in the test class
if "__main__" == __name__:
    TestClass().test()
