from py_pdf_parser.loaders import load_file
from py_pdf_parser.visualise import visualise
from py_pdf_parser.exceptions import NoElementFoundError

import json
import re


class WellsFargoPdfDocumentBaseClass:
    """Wells Fargo PDF Doc base class

    Args:
        file (str): The file path, either absolute or relative.
        statement_type ("checking"|"credit"|"savings"): The file path, either absolute or relative.
    """

    def __init__(self, file, statement_type):
        self.parsed_document = self._load_doc(file)
        self.statement_type = statement_type
        self.column_headers = self._get_column_headers_based_on_statement_type()
        self.number_of_rows = self._tag_dated_row_data()

        # side-effects needing to happen
        self._set_column_tags()

    def _get_column_headers_based_on_statement_type(self):
        type = self.statement_type
        elements = self.parsed_document.elements

        if type == "checking":
            return {
                "date": elements.filter_by_regex(r"^date$", re.IGNORECASE),
                "check": elements.filter_by_regex(r"^check$", re.IGNORECASE),
                "description": elements.filter_by_regex(
                    r"^number description$", re.IGNORECASE
                ),
                "deposits": elements.filter_by_regex(r"^deposits/$", re.IGNORECASE),
                "withdrawals": elements.filter_by_regex(
                    r"^withdrawals/$", re.IGNORECASE
                ),
            }
        if type == "credit":
            return {
                "trans": elements.filter_by_regex(r"^trans$", re.IGNORECASE),
                "post": elements.filter_by_regex(r"^post$", re.IGNORECASE),
                "reference": elements.filter_by_regex(
                    r"^reference number$", re.IGNORECASE
                ),
                "description": elements.filter_by_regex(
                    r"^description$", re.IGNORECASE
                ),
                "credits": elements.filter_by_regex(r"^credits$", re.IGNORECASE),
                "charges": elements.filter_by_regex(r"^charges$", re.IGNORECASE),
            }
        if type == "savings":
            return {}

    def _set_column_tags(self):
        for tag, elements in self.column_headers.items():
            print(tag)
            elements.add_tag_to_elements(tag)
            elements.add_tag_to_elements("identifiedAsColumnHeader")

    def _get_json_from_row_element(self, row_element):
        try:
            column_header = (
                self.parsed_document.elements.vertically_in_line_with(row_element)
                .filter_by_tag("identifiedAsColumnHeader")
                .extract_single_element()
            )

            if self.statement_type == "checking":
                if "date" in column_header.tags:
                    return {"date": row_element.text()}
                if "check" in column_header.tags:
                    return {"check": row_element.text()}
                if "description" in column_header.tags:
                    # ----------------------------------------------------------- Do extra work here!!
                    return {"description": row_element.text()}
                if "deposits" in column_header.tags:
                    return {"deposits": row_element.text()}
                if "withdrawals" in column_header.tags:
                    return {"withdrawals": row_element.text()}
            if self.statement_type == "credit":
                if "trans" in column_header.tags:
                    return {"trans": row_element.text()}
                if "post" in column_header.tags:
                    return {"post": row_element.text()}
                if "reference" in column_header.tags:
                    return {"reference": row_element.text()}
                if "description" in column_header.tags:
                    # ----------------------------------------------------------- Do extra work here!!
                    return {"description": row_element.text()}
                if "credits" in column_header.tags:
                    return {"credits": row_element.text()}
                if "charges" in column_header.tags:
                    return {"charges": row_element.text()}
            # if self.statement_type == "savings":
            #     pass
        except NoElementFoundError:
            print(
                f"\nCould not determine a column header!\nNo data returned for a known row: {row_element.text()}"
            )
            return {}

    def _get_json_from_row_elements(self, row_elements):
        json_row_data = {}
        for element in row_elements:
            element_json = self._get_json_from_row_element(element)
            json_row_data.update(element_json)

        return json_row_data

    def get_json(self):
        json_data = []
        for row_number in range(self.number_of_rows):
            row_tag = f"row_{row_number}"
            row_elements = self.parsed_document.elements.filter_by_tag(row_tag)
            row_json = self._get_json_from_row_elements(row_elements)

            if len(row_json) < 3:
                raise Exception(
                    f"Every row should parse to have at least three key, value pairs. This object:\n\n{row_json}\n\ndoesn't conform to our expectations."
                )
            json_data.append(row_json)
            # visualise(self.parsed_document, elements=row_elements)

        return json.dumps(json_data)

    def _get_dated_row_data(self):
        return self.parsed_document.elements.filter_by_regex(
            r"^[1|0]?[0-9]\/[0-3]?[0-9]$"
        )

    def get_data_by_tag(self, tag):
        return self.parsed_document.elements.filter_by_tag(tag)

    def _tag_dated_row_data(self):
        dated_row_data = self._get_dated_row_data()
        row_number = 0
        for dated_data in dated_row_data:
            # Tag row number
            dated_data.add_tag(f"row_{row_number}")
            self.parsed_document.elements.horizontally_in_line_with(
                dated_data
            ).add_tag_to_elements(f"row_{row_number}")
            # Tag that this has been identified as a row
            dated_data.add_tag("identifiedAsRow")
            self.parsed_document.elements.horizontally_in_line_with(
                dated_data
            ).add_tag_to_elements("identifiedAsRow")

            # Increment row number
            row_number += 1

        # Return the number of rows we find
        return row_number

    def get_parsed_doc(self):
        return self.parsed_document

    def _load_doc(self, file):
        return load_file(
            file, {"line_overlap": 0.01, "line_margin": 0.01, "boxes_flow": None}
        )
