CC = gcc
CFLAGS = -O2 -Wall -Wextra -std=c99
SRC_DIR = src
TEST_DIR = tests
TARGET = code_dna_analyzer.exe
TEST_TARGET = test_engine.exe

SRCS = $(SRC_DIR)/main.c $(SRC_DIR)/analyzer.c $(SRC_DIR)/structures.c $(SRC_DIR)/algorithms.c $(SRC_DIR)/complexity.c
TEST_SRCS = $(TEST_DIR)/test_engine.c $(SRC_DIR)/analyzer.c $(SRC_DIR)/structures.c $(SRC_DIR)/algorithms.c $(SRC_DIR)/complexity.c

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) $(SRCS) -o $(TARGET)

test: $(TEST_TARGET)
	./$(TEST_TARGET)

$(TEST_TARGET): $(TEST_SRCS)
	$(CC) $(CFLAGS) $(TEST_SRCS) -o $(TEST_TARGET)

clean:
	rm -f $(TARGET) $(TEST_TARGET) *.o
