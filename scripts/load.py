from py_pdf_parser.loaders import load_file
from py_pdf_parser.visualise import visualise

def get_page():
    return load_file("../pdfs-sensative/Document.pdf")

if "__main__" == __name__:
    doc = get_page()
    date = doc.pages[0].elements.filter_by_regex(r"[1]?[0-9]\/[1-3]?[0-9]")[2]
    print(date.text())
    expected = doc.pages[0].elements.horizontally_in_line_with(date)
    # doc.pages[0].elements.filter_by_fonts("Helvetica,7.8",  "Helvetica-Bold,7.8").__or__(doc.pages[1].elements.filter_by_fonts("Helvetica,7.8",  "Helvetica-Bold,7.8"))
    visualise(doc, elements=expected)
    # doc = get_page()
    # for element in doc.pages[1].elements:
    #     print(element.font)

# @see {https://pdfminersix.readthedocs.io/en/latest/reference/composable.html#laparams}


    #
    # for element in expected:
    #     print(element.text())
    # print("########## table ##########")
    # table = extract_table(expected, True, True, True, True)
    # print(table)
