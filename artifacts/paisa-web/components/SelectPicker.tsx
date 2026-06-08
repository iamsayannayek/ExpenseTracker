import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useAppColors } from "@/hooks/useAppColors";

export interface SelectOption {
  label: string;
  value: string;
  group?: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SelectPicker({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: Props) {
  const c = useAppColors();
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);
  const insets = useSafeAreaInsets();

  // Group options
  const grouped: { title: string | null; data: SelectOption[] }[] = [];
  const seen: Record<string, boolean> = {};
  options.forEach((o) => {
    const g = o.group ?? null;
    const key = g ?? "__none__";
    if (!seen[key]) {
      seen[key] = true;
      grouped.push({ title: g, data: [] });
    }
    grouped[grouped.length - 1].data.push(o);
  });

  type Item =
    | { type: "header"; title: string }
    | { type: "option"; item: SelectOption };
  const flat: Item[] = [];
  grouped.forEach((g) => {
    if (g.title) flat.push({ type: "header", title: g.title });
    g.data.forEach((o) => flat.push({ type: "option", item: o }));
  });

  const styles = StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    triggerText: {
      color: selected ? c.text : c.mutedForeground,
      fontSize: 14,
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "70%",
    },
    sheetHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    sheetTitle: { color: c.text, fontSize: 16, fontWeight: "700" },
    headerItem: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
    headerText: {
      color: c.mutedForeground,
      fontSize: 11,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    optionText: { color: c.text, fontSize: 14 },
    activeOption: { backgroundColor: c.surfaceElevated },
    safeArea: { backgroundColor: c.surface },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color={c.mutedForeground} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
          >
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Feather name="x" size={20} color={c.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={flat}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => {
                if (item.type === "header") {
                  return (
                    <View style={styles.headerItem}>
                      <Text style={styles.headerText}>{item.title}</Text>
                    </View>
                  );
                }
                const isSelected = item.item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.activeOption,
                    ]}
                    onPress={() => {
                      onChange(item.item.value);
                      setOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && { color: c.primary, fontWeight: "600" },
                      ]}
                    >
                      {item.item.label}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color={c.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <SafeAreaView edges={["bottom"]} style={styles.safeArea} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
