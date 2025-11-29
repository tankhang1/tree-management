import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  ActionIcon,
  Tooltip,
  Autocomplete,
  Checkbox,
} from "@mantine/core";
import {
  IconUser,
  IconId,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuilding,
  IconSearch,
} from "@tabler/icons-react";
import Scrollable from "../Scrollable";
import { useEffect, useMemo, useState } from "react";
import { useCompanyStore } from "../../pages/zustand/companyStore";

type TCompanyList = {
  isMultiple?: boolean;
  value?: string[]; // selected company ids (controlled)
  onChange?: (ids: string[]) => void;
};

export function CompanyList({
  isMultiple = false,
  value,
  onChange,
}: TCompanyList) {
  const { companies } = useCompanyStore();

  const [search, setSearch] = useState("");
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  const selectedId = value !== undefined ? value : internalSelected;

  const setSelectedId = (ids: string[]) => {
    if (value === undefined) {
      setInternalSelected(ids);
    }
    onChange?.(ids);
  };

  const onSelect = (id: string) => {
    if (isMultiple) {
      if (selectedId.includes(id)) {
        setSelectedId(selectedId.filter((item) => item !== id));
      } else {
        setSelectedId([...selectedId, id]);
      }
    } else {
      setSelectedId([id]);
    }
  };

  const suggestions = useMemo(
    () =>
      Array.from(
        new Set(
          companies.flatMap((c) => [c.name, c.id, c.phone, c.email, c.address])
        )
      ),
    [companies]
  );

  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.toLowerCase();
    return companies.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    });
  }, [companies, search]);

  useEffect(() => {
    if (value && !isMultiple && value.length > 1) {
      setSelectedId([value[0]]);
    }
  }, [value, isMultiple]);

  return (
    <Stack gap="xs">
      <Text fw={500} fz={15}>
        Doanh nghiệp/ Nông hộ
      </Text>

      <Autocomplete
        placeholder="Tìm doanh nghiệp/ nông hộ"
        leftSection={<IconSearch size={18} />}
        radius={4}
        data={suggestions}
        value={search}
        onChange={setSearch}
      />

      <Scrollable>
        <Group align="flex-start" wrap="nowrap" gap="md" p="xs">
          {filteredCompanies.map((item) => (
            <Card
              key={item.id}
              shadow="md"
              padding="lg"
              radius={4}
              miw={500}
              h={300}
              onClick={() => onSelect(item.id)}
              withBorder
              style={{
                position: "relative",
                transition: "transform 0.2s ease",
                borderColor: selectedId.includes(item.id) ? "green" : undefined,
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <Group justify="space-between">
                <Group>
                  <IconBuilding size={32} />
                  <div>
                    <Text size="lg" fw={700}>
                      {item.name}
                    </Text>
                    <Group>
                      <Badge color="green" variant="light" mt={4}>
                        {item.type}
                      </Badge>
                      {isMultiple && (
                        <Checkbox
                          checked={selectedId.includes(item.id)}
                          radius={4}
                          onChange={() => onSelect(item.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </Group>
                  </div>
                </Group>

                <Tooltip label="Xem chi tiết" withArrow>
                  <ActionIcon
                    color="blue"
                    variant="light"
                    radius="xl"
                    size="lg"
                  >
                    <IconUser />
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Stack mt="md" gap="xs">
                <Group>
                  <IconUser size={18} />
                  <Text size="sm">
                    <strong>Chủ sở hữu:</strong> {item.name}
                  </Text>
                </Group>

                <Group>
                  <IconId size={18} />
                  <Text size="sm">
                    <strong>CCCD/CMND:</strong> {item.id}
                  </Text>
                </Group>

                <Group>
                  <IconPhone size={18} />
                  <Text size="sm">
                    <strong>SĐT:</strong> {item.phone}
                  </Text>
                </Group>

                <Group>
                  <IconMail size={18} />
                  <Text size="sm">
                    <strong>Email:</strong> {item.email}
                  </Text>
                </Group>

                <Group align="start">
                  <IconMapPin size={18} style={{ marginTop: 2 }} />
                  <Text size="sm">
                    <strong>Địa chỉ:</strong> {item.address}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </Group>
      </Scrollable>
    </Stack>
  );
}
