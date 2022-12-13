from py_pdf_parser.loaders import load_file
from py_pdf_parser.visualise import visualise

import re

def get_page(): #
    return load_file("../pdfs-sensative/Document.pdf", { "line_overlap":0.01, "line_margin":0.01 })

if "__main__" == __name__:
    doc = get_page()
    accounting_number = doc.elements.to_the_right_of(doc.elements.filter_by_regex(r"^account number$", re.IGNORECASE)[0])
    billing_period = doc.elements.to_the_right_of(doc.elements.filter_by_regex(r"^statement billing period$", re.IGNORECASE)[0])
    # visualise(doc, elements=billing_period|accounting_number)
    print(accounting_number.extract_single_element().text())
    print(billing_period.extract_single_element().text())
    dates = doc.elements.filter_by_regex(r"^[1|0]?[0-9]\/[0-3]?[0-9]$")

    for date in dates:
        rowelements = doc.elements.horizontally_in_line_with(date).add_tag_to_elements("test")

    lines = doc.elements.filter_by_tag("test")
    visualise(doc, elements=lines)


# @see {https://pdfminersix.readthedocs.io/en/latest/reference/composable.html#laparams}


