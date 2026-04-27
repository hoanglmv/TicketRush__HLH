import os

sql_file = 'd:/Project/TicketRush__HLH/seed.sql'

# First remove the bad appended query from seed.sql by taking only the first 43 lines
with open(sql_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

clean_lines = []
for line in lines:
    if line.startswith('INSERT INTO seats'):
        break
    clean_lines.append(line)

zones = [
    (1, 5, 10),
    (5, 10, 15),
    (6, 10, 20),
    (2, 20, 20),
    (3, 5, 20),
    (4, 15, 15)
]

seats_sql = 'INSERT INTO seats (zone_id, `row_number`, col_number, label, status) VALUES\n'
values = []
for zone_id, total_rows, seats_per_row in zones:
    for r in range(total_rows):
        row_char = chr(ord('A') + r)
        for c in range(1, seats_per_row + 1):
            label = f"{row_char}{c}"
            values.append(f"({zone_id}, {r+1}, {c}, '{label}', 'AVAILABLE')")

seats_sql += ',\n'.join(values) + ';\n'

with open(sql_file, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)
    f.write('\n' + seats_sql)

print(f'Generated {len(values)} seats in seed.sql')
