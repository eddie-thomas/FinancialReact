from WellsFargoPdfDocument import WellsFargoPdfDocumentBaseClass

import json


def test():
    PDF = WellsFargoPdfDocumentBaseClass(
        "./pdfs-sensative/Document_credit.pdf", False, "credit"
    )
    received = json.loads(PDF.get_json())
    expected = get_mocked_expected()
    if received == expected:
        print(f"\nSuccessful test ran!")


def get_mocked_expected():
    return [
        {
            "trans": "12/28",
            "post": "12/28",
            "reference": "7446539BA36HHMG8K",
            "description": "ONLINE PAYMENT WEST DES MOIN",
            "credits": "992.03",
        },
        {
            "trans": "12/09",
            "post": "12/09",
            "reference": "2404048AR0V08SDRZ",
            "description": "JETBLUE 2792179905010 SALT LAKE CTY UTSARGENT/CAMRYN MISSDENVER BOSTON",
            "charges": "256.80",
        },
        {
            "trans": "12/09",
            "post": "12/09",
            "reference": "2444500AP8PVDT7Y0",
            "description": "KING SOOPERS #0011 GREELEY CO",
            "charges": "26.87",
        },
        {
            "trans": "12/10",
            "post": "12/10",
            "reference": "2469216AR2XDMDP3B",
            "description": "UNITED 0162382826179800-932-2732 TXTHOMAS/EDWARDBOSTON WASHINGTONWASHINGTON DENVER",
            "charges": "117.20",
        },
        {
            "trans": "12/10",
            "post": "12/10",
            "reference": "2469216AR2XDMDP33",
            "description": "UNITED 0162382826178800-932-2732 TXSARGENT/CAMRYNBOSTON WASHINGTONWASHINGTON DENVER",
            "charges": "117.20",
        },
        {
            "trans": "12/13",
            "post": "12/13",
            "reference": "2403454AV018TSRQD",
            "description": "CONOCO - ZUNI CONOCO DENVER CO",
            "charges": "24.68",
        },
        {
            "trans": "12/16",
            "post": "12/16",
            "reference": "2444500AZHEYAZZZK",
            "description": "WALGREENS.COM PHOTO #1624800-289-2273 IL",
            "charges": "4.16",
        },
        {
            "trans": "12/16",
            "post": "12/16",
            "reference": "2469216AY2XYXTN8Y",
            "description": "AMZN Mktp US*Z01TC3PJ3 Amzn.com/bill WA",
            "charges": "20.32",
        },
        {
            "trans": "12/16",
            "post": "12/16",
            "reference": "2469216AZ2X6F2DJD",
            "description": "CIRCLE K # 40641 GREELEY CO",
            "charges": "19.17",
        },
        {
            "trans": "12/17",
            "post": "12/17",
            "reference": "2423168B0RBGJZ2D1",
            "description": "SAFEWAY #1440 MONUMENT CO",
            "charges": "58.85",
        },
        {
            "trans": "12/17",
            "post": "12/17",
            "reference": "2475542B07MDJYNX5",
            "description": "TRI LAKES LIQUOR MONUMENT CO",
            "charges": "12.84",
        },
        {
            "trans": "12/18",
            "post": "12/18",
            "reference": "2431605B1FZ4F1JPQ",
            "description": "SHELL OIL 57444359806 GREELEY CO",
            "charges": "52.74",
        },
        {
            "trans": "12/19",
            "post": "12/19",
            "reference": "2424760B18PXZQPSD",
            "description": "ROCKY MOUNTAIN GROCERY GRAND LAKE CO",
            "charges": "37.83",
        },
        {
            "trans": "12/19",
            "post": "12/19",
            "reference": "2469216B12XJN0XGN",
            "description": "SQ *HELLO COFFEE, LLC Lakewood CO",
            "charges": "21.02",
        },
        {
            "trans": "12/19",
            "post": "12/19",
            "reference": "2469216B12XKF07N8",
            "description": "SQ *HELLO COFFEE, LLC Lakewood CO",
            "charges": "2.80",
        },
        {
            "trans": "12/20",
            "post": "12/20",
            "reference": "2449215B2MJS99R4Q",
            "description": "SQ *JUMP START GRAND LAKE CO",
            "charges": "5.59",
        },
        {
            "trans": "12/20",
            "post": "12/20",
            "reference": "2469216B22XHJDA10",
            "description": "SQ *QUACKER GIFT SHOP Grand Lake CO",
            "charges": "4.37",
        },
        {
            "trans": "12/21",
            "post": "12/21",
            "reference": "2444500B38PWVXD4Q",
            "description": "KING SOOPERS #0011 GREELEY CO",
            "charges": "6.59",
        },
        {
            "trans": "12/22",
            "post": "12/22",
            "reference": "2441295B5BMQA4X0G",
            "description": "GREELEY ARC THRIFT GREELEY CO",
            "charges": "34.74",
        },
        {
            "trans": "12/22",
            "post": "12/22",
            "reference": "2444500B48PXKM0WT",
            "description": "KING SOOPERS #0011 GREELEY CO",
            "charges": "57.65",
        },
        {
            "trans": "12/23",
            "post": "12/23",
            "reference": "2413746B601WBFJY2",
            "description": "GOODWILL GREELEY STORE GREELEY CO",
            "charges": "38.97",
        },
        {
            "trans": "12/23",
            "post": "12/23",
            "reference": "2469216B52XNNYQ27",
            "description": "AMZN Mktp US*3G0CG7KS3 Amzn.com/bill WA",
            "charges": "8.02",
        },
        {
            "trans": "12/24",
            "post": "12/24",
            "reference": "2480197B7RDQAG5JX",
            "description": "COSMIC MARKET GREELEY CO",
            "charges": "9.05",
        },
        {
            "trans": "12/28",
            "post": "12/28",
            "reference": "2420785BA12LMVSFS",
            "description": "THE VILLAGE GROCER JENSEN BEACH FL",
            "charges": "17.09",
        },
        {
            "trans": "12/30",
            "post": "12/30",
            "reference": "2401868BDEJBGL67B",
            "description": "CANOPY AIRPORT PARKING COMMERCE CITY CO",
            "charges": "3.08",
        },
        {
            "trans": "12/30",
            "post": "12/30",
            "reference": "2444500BQ8PVEQ9W1",
            "description": "KING SOOPERS #0611 FUEL GREELEY CO",
            "charges": "50.85",
        },
        {
            "trans": "12/30",
            "post": "12/30",
            "reference": "2444500BQ8PVEQ9YK",
            "description": "KING SOOPERS #0011 GREELEY CO",
            "charges": "83.56",
        },
        {
            "trans": "01/02",
            "post": "01/02",
            "reference": "2405522QKBLWRAPPJ",
            "description": "WESTLAKE WINE & SPIRITS GREELEY CO",
            "charges": "10.69",
        },
        {
            "trans": "01/02",
            "post": "01/02",
            "reference": "7414361QL00KMTPH6",
            "description": "AERLING 2JEGT2 SARGEN DUBLIN IEEURO CURRNCY119.94 X 1.13840253SARGENT CAMRYN MISSDUBLIN PARIS",
            "charges": "136.54",
        },
        {
            "trans": "01/02",
            "post": "01/02",
            "reference": "7469769QKSRV9SRGY",
            "description": "AWP P&C S.A DUTCH BRAN AMSTERDAM NLEURO CURRNCY21.07 X 1.13953488",
            "charges": "24.01",
        },
        {
            "trans": "01/03",
            "post": "01/03",
            "reference": "2444500QK8PTXX61G",
            "description": "KING SOOPERS #0011 GREELEY CO",
            "charges": "20.23",
        },
        {
            "trans": "01/03",
            "post": "01/03",
            "reference": "2449215QKR5YLL1X7",
            "description": "WELD COUNTY SCHOOL 970-587-6050 CO",
            "charges": "8.50",
        },
        {
            "trans": "01/03",
            "post": "01/03",
            "reference": "2469216QK2XNXVXEN",
            "description": "CHEWY.COM 800-672-4399 FL",
            "charges": "85.60",
        },
        {
            "trans": "01/04",
            "post": "01/04",
            "reference": "2469216QL2XP18NTG",
            "description": "BEAR COUNTRY SALOON GE GREELEY CO",
            "charges": "10.00",
        },
        {
            "trans": "01/05",
            "post": "01/05",
            "reference": "2401339QM00D5NS9A",
            "description": "COS PARKING METERS COLORADO SPRI CO",
            "charges": "5.50",
        },
        {
            "trans": "01/05",
            "post": "01/05",
            "reference": "2449215QMLVS07EA8",
            "description": "TM TICKETMASTER 800-653-8000 CA",
            "charges": "140.99",
        },
        {
            "trans": "01/05",
            "post": "01/05",
            "reference": "2449215QMLVVGV2VH",
            "description": "AIRBNB HMKQDW5Q2T AIRBNB.COM CA",
            "charges": "70.85",
        },
        {
            "trans": "01/05",
            "post": "01/05",
            "reference": "2449215QMMMVR765X",
            "description": "ALLIANZ EVENT INS ALLIANZINS.US VA",
            "charges": "18.00",
        },
        {
            "trans": "01/06",
            "post": "01/06",
            "reference": "2449215QNML552L7A",
            "description": "AIRBNB HMMY9PYJBW AIRBNB.COM CATOTAL PURCHASES, BALANCE TRANSFERS & OTHER CHARGES FOR THIS PERIOD",
            "charges": "84.13",
        },
        {
            "trans": "01/02",
            "post": "01/02",
            "reference": "7414361QL00KMTPH6",
            "description": "FOREIGN CURRENCY CONVERSION FEE",
            "charges": "4.10",
        },
        {
            "trans": "01/02",
            "post": "01/02",
            "reference": "7469769QKSRV9SRGY",
            "description": "FOREIGN CURRENCY CONVERSION FEE",
            "charges": "0.72",
        },
    ]


if "__main__" == __name__:
    test()

# @see {https://pdfminersix.readthedocs.io/en/latest/reference/composable.html#laparams}
