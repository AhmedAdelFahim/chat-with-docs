import os


def write_file(data, path, mode):
    file = open(path, mode)
    file.write(data)
    file.close()


def delete_file_if_exist(path):
    if os.path.exists(path):
        os.remove(path)
    else:
        print("The file does not exist")
