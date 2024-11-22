#!/usr/bin/perl
# =Read option1 and option 2 data and store it on the appropriate fields.
#  Includes feature to track any data that might have a mixed value of options
#  20-6-2024 Howard Tierra
#  SR-10
# 
#  This is the first step in the process of obtaining sku for every line of an old invoice.
#  This runs on invoice files that do not have SKU.
#  Change the header of the invoice file to be same as (cut and paste this tab delimited row)
#  invoiceNumber	invoiceDate	qty	masterCode	oldCode	sku	opt1	opt2	description	unitPrice	totalPrice	length	crystalColor	color	Gauge	size	czColor	qtyInPack	bulkQuantity	height	width	itemType	ringSize	rack	packingOption
# /home/howardt/MernStart/_utils/csv-processor/updatedInvoiceWithFields.csv
# 

use strict;
use warnings;
use Text::CSV;

# Define the array of options fields
my @options = ("opt1", "opt2");

# Define the extended fields array
my @extendFields = ("Pincher Size", "Ring", "banana", "");
my @allowdOptions = ("Pincher Size", "Ring", "banana", "Pincher Size", "Ring", "banana");
my $is_exception = 0;

# Open the input and output files
my $input_file = 'colnames13J_10-30-24_16_15_27_Full.tsv';
my $output_file = 'updated_SR-11'.$input_file.'.csv';
my $exceptions_file = 'exceptions'.$output_file;

open my $in, '<', $input_file or die "Could not open '$input_file': $!\n";
open my $out, '>', $output_file or die "Could not open '$output_file': $!\n";
open my $exceptions, '>', $exceptions_file or die "Could not open '$exceptions_file': $!\n";


# Set up CSV handlers for tab-delimited input and comma-delimited output
my $csv_in = Text::CSV->new({ sep_char => "\t", binary => 1, auto_diag => 1 });
my $csv_out = Text::CSV->new({ sep_char => ",", binary => 1, auto_diag => 1 });
my $csv_exceptions = Text::CSV->new({ sep_char => ",", binary => 1, auto_diag => 1 });


# Read the header
my $header = $csv_in->getline($in);
$csv_in->column_names(@$header);

# Write the header to the output file
$csv_out->print($out, $header);
print $out "\n";  # Ensure a newline after the header


# Process each row
while (my $row = $csv_in->getline_hr($in)) {
    # Flag to track if the row meets specific criteria
    $is_exception = 0;

    # Skip rows where invoiceNumber starts with "Now"
    next if $row->{'invoiceNumber'} =~ /^Now/;

    # Print opt1 and opt2 to console
    foreach my $opt (@options) {
        # print "$opt: " . $row->{$opt} . "\n";
        
        # Check the first word in the option field
        if ($row->{$opt} =~ /^([^:]+):\s*(.*)/) {
            my $first_part = $1;
            my $rest = $2;
            # print "First: $first_part \n";
            # print "data: $rest \n";
            
            # If the first word is in @extendFields, process it
           if (grep { lc $_ eq lc $first_part } @extendFields) {
                # Extract the first word of $first_part
                if ($first_part =~ /^(\w+)/) {
                   $row->{'itemType'} = $1;  # Assign the first word to itemType
                }
    
                my @multiPart = split /\s*&\s*/, $rest;  # Split by '&'
                foreach my $part (@multiPart) {
                    process_option($row, $part);
                    # print "Passing parameter: $part to subroutine \n";
                }
            } else {
                # print "Not Found: $first_part on row: $row \n";
                # print "Passing parameter: $first_part: $2 to subroutine \n";
                # Process the option field normally;
                process_option($row,$first_part.": ".$2 );
            }
        }
    }

    # Check if the row meets specific criteria to be considered an exception
    if ($is_exception) {
        $csv_exceptions->print($exceptions, [@$row{@$header}]);
        print $exceptions "\n";  # Ensure a newline after each row
    } else {
        # Write the processed row to the output file
        $csv_out->print($out, [@$row{@$header}]);
        print $out "\n";  # Ensure a newline after each row
    }
}

# Close the files
close $in or die "Could not close '$input_file': $!\n";
close $out or die "Could not close '$output_file': $!\n";

print "Processing complete. Check the file '$output_file'.\n";

# Subroutine to process the option fields and update the row hash reference
sub process_option {
     my ($row, $columnOption) = @_;

    # Check if the columnOption contains multiple key-value pairs
    if ($columnOption =~ /:/) {
        process_multiple_options($row, $columnOption);
    } else {

        # my ($row, $columnOption) = @_;
        # print "..processing option: $columnOption \n";

        # Process the option field for specific rules
        if ($columnOption =~ /^length:\s*(.*)/i) {
            $row->{'length'} = $1;
        } elsif ($columnOption =~ /^Height:\s*(.*)/i) {
            $row->{'height'} = $1;
        }elsif ($columnOption =~ /^Packing Option:\s*(.*)/i) {
            $row->{'packingOption'} = $1;
        } elsif ($columnOption =~ /^gauge:\s*(.*)/i) {
            $row->{'Gauge'} = $1;
        } elsif ($columnOption =~ /^Quantity In Bulk:\s*(.*)/i) {
            $row->{'bulkQuantity'} = $1;
        } elsif ($columnOption =~ /^crystal color:\s*(.*)/i) {
            $row->{'crystalColor'} = $1;
        } elsif ($columnOption =~ /^size:\s*(.*)/i) {
            $row->{'size'} = $1;
        } elsif ($columnOption =~ /^color:\s*(.*)/i) {
            $row->{'color'} = $1;
        } elsif ($columnOption =~ /^Cz Color:\s*(.*)/i) {
            $row->{'czColor'} = $1;
        } elsif ($columnOption =~ /^ring size:\s*(.*)/i) {
            $row->{'ringSize'} = $1;
        } elsif ($columnOption =~ /^thickness\s*(.*)/i) {
            $row->{'Gauge'} = $1;
        } elsif ($columnOption =~ /^width\s*(.*)/i) {
            $row->{'ringSize'} = $1;
        } else {
          # all others not above will be an exception
          print "Bad row '$columnOption'.\n";      
          $is_exception = 1;
        }
    }
}


# Subroutine to process multiple key-value pairs in the option fields
sub process_multiple_options {
    my ($row, $columnOption) = @_;

    my @pairs = split /\s*(?<!\\):\s*/, $columnOption;
    foreach my $pair (@pairs) {
        my ($key, $value) = split /:\s*/, $pair;
        if ($key && $value) {
            if ($key =~ /length/i) {
                $row->{'length'} = $value;
            } elsif ($key =~ /height/i) {
                $row->{'height'} = $value;
            } elsif ($key =~ /packing option/i) {
                $row->{'packingOption'} = $value;
            } elsif ($key =~ /gauge/i) {
                $row->{'Gauge'} = $value;
            } elsif ($key =~ /quantity in bulk/i) {
                $row->{'bulkQuantity'} = $value;
            } elsif ($key =~ /crystal color/i) {
                $row->{'crystalColor'} = $value;
            } elsif ($key =~ /size/i) {
                $row->{'size'} = $value;
            } elsif ($key =~ /color/i) {
                $row->{'color'} = $value;
            } elsif ($key =~ /cz color/i) {
                $row->{'czColor'} = $value;
            } elsif ($key =~ /ring size/i) {
                $row->{'ringSize'} = $value;
            } elsif ($key =~ /thickness/i) {
                $row->{'Gauge'} = $value;
            } elsif ($key =~ /width/i) {
                $row->{'ringSize'} = $value;
            } elsif ($key =~ /yellow/i) {
                $row->{'color'} = $value;
            } else {
                $is_exception = 1;
            }
        } else {
            # all others not above will be an exception
            print "Bad row '$columnOption'.\n";      
            $is_exception = 1;
        }
    }
}