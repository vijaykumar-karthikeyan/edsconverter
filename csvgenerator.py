import pandas as pd

file_path = '/content/VK_001_Raw Data_20250210_150641.csv'

import pandas as pd

# Open the CSV and find the row index where "Well" appears
with open(file_path, "r") as file:
    for i, line in enumerate(file):
        if "X1_M1" in line:  # Check if the line contains "Well" (case-sensitive)
            header_row = i
            break

# Read the CSV, skipping all lines before the detected header
raw_data = pd.read_csv(file_path, skiprows=header_row)
raw_data = raw_data.drop(columns=["X2_M2", "X4_M4", "X3_M3", "X5_M5"])
df = raw_data.sort_values(by=["Well Position", "Cycle Number"])

import pandas as pd
import natsort

# Sort the Well Position column in a natural order
well_positions_sorted = natsort.natsorted(df['Well Position'].unique())

# Create an empty list to hold the columns for the new DataFrame
kd_data = []

# Loop through each well position and get the first 37 fluorescence values
for well_position in well_positions_sorted:
    # Filter the data for the current well and get the first 37 values of X1_M1
    well_data = df[df['Well Position'] == well_position].iloc[:37]['X1_M1'].values
    kd_data.append(well_data)

# Create a new DataFrame with the well positions as columns
kd = pd.DataFrame(kd_data).T  # Transpose so each well is a column

# Assign the correctly sorted well positions as column names (headers)
kd.columns = well_positions_sorted

# Save the DataFrame to a CSV file with headers
# getting the directory

dir = []# List of well positions you want to keep (e.g., A1, A2, A3, ...)
dir = ['A1', 'B1', 'A2']  # Add all the well positions you want to keep

# Keep only the columns that are in the 'dir' list
kd_filtered = kd[dir]
kd_filtered.to_csv("kd_filtered.csv", index=False)  # Save without index

timestamp = datetime.now().strftime("%Y%m%d%H%M%S")  # Format: YYYYMMDDHHMMSS
filename = f"kd{timestamp}.csv"  

kd_filtered.to_csv(filename, index=False, header=False)  # Ensure headers are excluded

# Read the CSV without headers
df = pd.read_csv(filename, header=None)  
final_kd = df.reset_index(drop=True)  # Reset index if needed

final_kd.head()  # Display the first few rows