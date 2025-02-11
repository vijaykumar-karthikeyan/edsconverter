import os
import matplotlib.pyplot as plt

# Create the "graphs" folder if it doesn't exist
os.makedirs('graphs', exist_ok=True)

# Define cycle numbers starting from 0 up to 36 (since there are 37 data points)
cycle_numbers = list(range(37))

# Loop through each well in kd_filtered and generate a plot
for well_position in kd_filtered.columns:
    # Extract fluorescence data
    fluorescence_values = kd_filtered[well_position]

    # Create the plot
    plt.figure(figsize=(8, 6))
    plt.plot(cycle_numbers, fluorescence_values, label=well_position)

    # Add labels and title
    plt.xlabel('Cycle Number (Time)')
    plt.ylabel('Fluorescence (X1_M1)')
    plt.title(f'Time vs Fluorescence for {well_position}')

    # Save the plot as a PNG file in the "graphs" folder
    file_path = os.path.join('graphs', f'{well_position}.png')
    plt.savefig(file_path)

    # Close the figure to save memory
    plt.close()