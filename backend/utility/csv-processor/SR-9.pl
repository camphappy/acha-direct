# !/usr/bin/perl
# =Read option1 and option 2 data and store it on the appropriate fields.
#  Includes feature to track any data that might have a mixed value of options
#  20-6-2024 Howard Tierra
#  SR-9
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
my @extendFields = ("Pincher Size", "Ring", "banana");

# Open the input and output files
my $input_file = 'Final_2024_colnames13J_NoSKU.tsv';
my $output_file = 'updated_SR-09'.$input_file.'.csv';

open my $in, '<', $input_file or die "Could not open '$input_file': $!\n";
open my $out, '>', $output_file or die "Could not open '$output_file': $!\n";

# Set up CSV handlers for tab-delimited input and comma-delimited output
my $csv_in = Text::CSV->new({ sep_char => "\t", binary => 1, auto_diag => 1 });
my $csv_out = Text::CSV->new({ sep_char => ",", binary => 1, auto_diag => 1 });

# Read the header
my $header = $csv_in->getline($in);
$csv_in->column_names(@$header);

# Write the header to the output file
$csv_out->print($out, $header);
print $out "\n";  # Ensure a newline after the header


# Process each row
while (my $row = $csv_in->getline_hr($in)) {
    # Skip rows where invoiceNumber starts with "Now"
    next if $row->{'invoiceNumber'} =~ /^Now/;

    # Print opt1 and opt2 to console
    foreach my $opt (@options) {
        print "$opt: " . $row->{$opt} . "\n";
        
        # Check the first word in the option field
        if ($row->{$opt} =~ /^([^:]+):\s*(.*)/) {
            my $first_part = $1;
            my $rest = $2;
            print "First: $first_part \n";
            print "data: $rest \n";
            
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

    # Write the processed row to the output file
    $csv_out->print($out, [@$row{@$header}]);
    print $out "\n";  # Ensure a newline after each row
}

# Close the files
close $in or die "Could not close '$input_file': $!\n";
close $out or die "Could not close '$output_file': $!\n";

print "Processing complete. Check the file '$output_file'.\n";

# Subroutine to process the option fields and update the row hash reference
sub process_option {
    my ($row, $columnOption) = @_;
    # print "..processing option: $columnOption \n";

    # Process the option field for specific rules
    if ($columnOption =~ /^length:\s*(.*)/i) {
        $row->{'length'} = $1;
    } elsif ($columnOption =~ /^Height:\s*(.*)/i) {
        $row->{'height'} = $1;
    }elsif ($columnOption =~ /^Packing Option:\s*(.*)/i) {
        $row->{'packingOption'} = $1;
    } elsif ($columnOption =~ /^gauge:\s*(.*)/i) {
        $row->{'gauge'} = $1;
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
        $row->{'gauge'} = $1;
    } elsif ($columnOption =~ /^width\s*(.*)/i) {
        $row->{'ringSize'} = $1;
    }
}
