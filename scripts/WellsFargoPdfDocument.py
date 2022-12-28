import json
import re

from Exceptions import TooManyColumnsFoundError

from py_pdf_parser.loaders import load_file
from py_pdf_parser.visualise import visualise
from py_pdf_parser.exceptions import NoElementFoundError
from py_pdf_parser.components import ElementList, PDFElement

from typing import Literal


class WellsFargoPdfDocumentBaseClass:
    """Wells Fargo PDF Doc base class"""

    def __init__(
        self,
        file: str,
        show: bool,
        statement_type: Literal["checking", "credit", "savings"],
    ):
        """Initialize the base class

        Args:
            file (str): The file path, either absolute or relative.
            show (bool): Should we visualize the PDF after getting the data.
            statement_type ("checking"|"credit"|"savings"): The file path, either absolute or relative.
        """
        self.account_num: None | int = None
        self.parsed_document = self._load_doc(file)
        self.statement_type = statement_type
        self.column_headers = self._get_column_headers_based_on_statement_type()
        self.number_of_rows = self._tag_dated_row_data()
        self.show = show

        # Side-effects needing to happen.
        self._set_column_tags()
        self._set_account_number()

    # Private methods.
    def _get_column_headers_based_on_statement_type(self):
        """Method to get all the column header components, via a dictionary.

        Private

        Returns:
            `dict` where the key is our expected column and the value is an ElementList of
            all our column headers. If there are many transactions in the statement, it will
            span to multiple pages, so we much grab all the headers to appropriately parse
            the file.
        Raises:
            Exception: Raised when statement_type is not one of its expected values.
        """
        type = self.statement_type
        elements = self.parsed_document.elements

        if type == "checking":
            return {
                "date": elements.filter_by_regex(r"^date$", re.IGNORECASE),
                "description": elements.filter_by_regex(
                    r"^(number )?description$", re.IGNORECASE
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

        raise Exception(
            f'Statement type is not valid. {self.statement_type} does not conform to the type: ("checking"|"credit"|"savings").'
        )

    def _get_date_elements(self):
        """Method to get our date elements from PDF.

        Private

        Returns:
            ElementList containing every element in our PDF that matches on the RegExp below.
        """
        date_reg_exp = r"^[1|0]?[0-9]\/[0-3]?[0-9]$"
        return self.parsed_document.elements.filter_by_regex(date_reg_exp)

    def _get_dict_from_column_and_row_element(
        self, column_element: PDFElement, row_element: PDFElement
    ):
        """Method to get a `dict` given column and row element.

        Private

        Args:
            column_element (PDFElement): Column element.
            row_element (PDFElement): Row element.
        Returns:
            `dict` with the key being the tag of the `column_element` and the value being the
            `text()` of the `row_element`.
        Raises:
            Exception: This indicates a logic error that needs investigating. See the Exception
            message for more details.
        """
        for column_header_tag in sorted(self.column_headers.keys()):
            if column_header_tag in column_element.tags:
                # Do extra work here if we are a description.
                if column_header_tag == "description":
                    text = self._get_element_below_without_tag(row_element)
                    return {column_header_tag: text}
                return {column_header_tag: row_element.text()}

        # We want to raise an exception here to tell user that we cannot derive a dictionary
        # based on column and row elements.
        raise Exception(
            "Logic Error: Could not derive a dictionary given a column and a row. Look into issue."
        )

    def _get_dict_from_row_element(self, row_element: PDFElement):
        """Method to get a `dict` given a single element in our row.

        Private

        Args:
            row_element (PDFElement): Row element.
        Returns:
            `dict` with the key being the tag of the `column_element` and the value being the
            `text()` of the `row_element`.
        """
        try:
            potential_column_header = (
                self.parsed_document.elements.vertically_in_line_with(
                    row_element
                ).filter_by_tag("identifiedAsColumnHeader")
            )
            if potential_column_header.__len__() > 1:
                # Visualize when there are too many columns
                visualise(
                    self.parsed_document, elements=potential_column_header
                ) if self.show else None
                raise TooManyColumnsFoundError(
                    f"Too many column headers were found for this specific row element: {row_element.text()}"
                )

            column_header = potential_column_header.extract_single_element()

            return self._get_dict_from_column_and_row_element(
                column_header, row_element
            )

        except NoElementFoundError:
            # Visualize when there aren't any headers found, if this error becomes more common
            print(
                f"\nCould not determine a column header!\nNo data returned for a known row: {row_element.text()}"
            )
            return {}
        except TooManyColumnsFoundError:
            return {}

    def _get_dict_from_row_elements(self, row_elements: ElementList):
        """Method to get a `dict` given an ElementList representing all elements in our row.

        Private

        Args:
            row_elements (ElementList): List of elements in our row, we could also pass
            the row number explicitly. The row number is 0-indexed.
        Returns:
            A `dict` representing the [key-value] pairs expressing
            [column headers-row value associated with column-header].
        """
        json_row_data = {}
        for element in row_elements:
            element_dict = self._get_dict_from_row_element(element)
            json_row_data.update(element_dict)

        return json_row_data

    def _get_element_below_without_tag(self, element: PDFElement):
        """Method to get all of the elements below a specific one that hasn't been tagged yet.
        After iterating through them, we append their text to ours initial element and return.

        Note:
            We could take the last found description of the page and make sure we only add
            "potential" descriptions if there above the quote, "last" one, but it doesn't matter
            because we'd loose out on any strings below the last one. In the current
            implementation, we know we'll have every string, and maybe extras.
            Better to have more than less.

        Args:
            element (PDFElement): The main element we're looking at

        Returns:
            text (str): Text of the given element, along with the text of any elements
            below it that haven't been tagged yet.
        """
        text = element.text()
        elements_below = self.parsed_document.elements.below(element)
        for element_below in elements_below:
            # This stops the text from getting in if we are looking at the bottom transaction
            # I call this, good enough.
            if not len(
                self.parsed_document.elements.below(element_below).filter_by_tag(
                    "identifiedAsRow"
                )
            ):
                break
            # If anything we think could be additional text, has a tag then it's not what we want.
            if len(element_below.tags):
                break
            # Append text
            text += element_below.text()
            # Remove excess spacing.
        return re.sub(" +", " ", text)

    def _load_doc(self, file):
        """Load the document, via the `py_pdf_parser.load_file()` method.

        Private

        Args:
            file (str): The file path, either absolute or relative.
        Returns:
            PDFDocument: A PDFDocument with the specified file loaded.
        """
        return load_file(file, {"line_overlap": 0.01, "line_margin": 0.01})

    def _set_column_tags(self):
        """Method to set our column tags.

        Private
        """
        for tag, elements in self.column_headers.items():
            elements.add_tag_to_elements(tag)
            elements.add_tag_to_elements("identifiedAsColumnHeader")

    def _set_account_number(self):
        """Method to set the classes account number

        Note:
            So far, in all cases, we have either `Account number` or `Account number:`
            and the actual number is either part of the element or to the right of it.
            I believe we can expect this until multiple issues arise.
        """
        # RegExp for getting PDFElement.
        account_num_elem = self.parsed_document.elements.filter_by_regex(
            r"^account number[:]?", re.IGNORECASE
        )[0]

        try:
            # Try to parse account number into an int
            account_num_elem_text = account_num_elem.text()

            account_num = re.match(
                r"(?:^account number[:]?)([\s\d]+)",
                account_num_elem_text,
                re.IGNORECASE,
            ).group(1)
            self.account_num = account_num if f"{int(account_num)}"[-4:] else None
        except Exception:
            # If not, try getting the element beside it and check if that is the number.
            try:
                account_num = self.parsed_document.elements.to_the_right_of(
                    account_num_elem
                )[0]

                self.account_num = (
                    account_num.text()[-4:] if int(account_num.text()[-4:]) else None
                )
            # Otherwise raise exceptions.
            except Exception as e:
                print("\nCannot find account number.")
                raise e

    def _tag_dated_row_data(self):
        """Method to tag our dated data, and the elements inline
        with it, as a row and a tag signifying which row.

        Private

        Returns:
            The number of rows. For clarity, this number obtained from the 0-indexed
            array, then adding one at the end of the for-loop to get the exact number
            of rows.

            Note: This means that Row #1 will have a tag `row_0`.
        """
        dated_row_data = self._get_date_elements()
        row_number = 0
        for dated_data in dated_row_data:
            # We need to filter out multiple catches, this is only for credit statements,
            # which has a transaction and post date which will catch on the date RegExp.
            if "identifiedAsRow" in dated_data.tags:
                continue
            # Tag row number.
            dated_data.add_tag(f"row_{row_number}")
            self.parsed_document.elements.horizontally_in_line_with(
                dated_data
            ).add_tag_to_elements(f"row_{row_number}")
            # Tag that this has been identified as a row.
            dated_data.add_tag("identifiedAsRow")
            self.parsed_document.elements.horizontally_in_line_with(
                dated_data
            ).add_tag_to_elements("identifiedAsRow")

            # Increment row number.
            row_number += 1

        # Return the number of rows we find.
        return row_number

    # Public methods.
    def get_elements_by_tag(self, tag: str):
        """Method for getting elements via a specific tag.

        Args:
            tag (str): Tag we are filtering by
        """
        return self.parsed_document.elements.filter_by_tag(tag)

    def get_json(self):
        """Method invoking all of the needed functionality for converting the
        transaction data found in the PDF into textual JSON.

        Raises:
            Exception: We need at least three keys in our `row_dict` to consider it valid data.
        """
        json_data = []
        for row_number in range(self.number_of_rows):
            row_tag = f"row_{row_number}"
            row_elements = self.parsed_document.elements.filter_by_tag(row_tag)
            row_dict = self._get_dict_from_row_elements(row_elements)

            try:
                # Check if our row has enough data, if not then raise a warning
                if len(row_dict) < 3:
                    raise Warning(
                        f"\n\nCommon issues could be: \n\t- wrongly assigning the `statement_type`, confirm the actual document is the correct statement type.\n\n\nEvery row should parse to have at least three key, value pairs. This object:\n\n\t{row_dict}\n\ndoesn't conform to our expectations."
                    )
                json_data.append(row_dict)
            except Warning:
                visualise(
                    self.parsed_document, elements=row_elements
                ) if self.show else None

        return json.dumps(json_data)

    def get_parsed_doc_elements(self):
        """Method to get all document elements.

        Returns:
            ElementList
        """
        return self.parsed_document.elements
