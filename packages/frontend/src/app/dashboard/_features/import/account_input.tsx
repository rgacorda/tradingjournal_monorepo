import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Account } from "@/actions/accounts/account";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";


interface AccountInputProps {
    value: string
    setValue: (value: string) => void
  }
export function AccountInput({value, setValue}: AccountInputProps) {

    const { data} = useSWR<Account[]>("/account/", fetcher);


  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Platforms</SelectLabel>
          {data?.map(({ name, id }) => (
            <SelectItem key={id} value={id || ""}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
