import os

# Define the root directory of the project
root_directory = "."

# Function to replace occurrences of "index.html" with "index.html"
def replace_references():
    for subdir, _, files in os.walk(root_directory):
        for file in files:
            file_path = os.path.join(subdir, file)
            try:
                # Read the file
                with open(file_path, "r", encoding="utf-8") as f:
                    lines = f.readlines()
                
                # Check if the target term exists and replace it
                updated_lines = [line.replace("index.html", "index.html") for line in lines]
                
                # Write the updated content back to the file
                with open(file_path, "w", encoding="utf-8") as f:
                    f.writelines(updated_lines)
                
                print(f"Updated references in: {file_path}")
            
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    replace_references()
