import { Controller, useForm } from "react-hook-form"
import { Button, Image, Input, Select } from "antd";
import { SwapOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SwapForm = () => {
  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm();

  const [prices, setPrices] = useState({})
  const [fromCurrency, setFromCurrency] = useState("")
  const [toCurrency, setToCurrency] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [amount, setAmount] = useState()

  const selectOptions = Object.values(prices).map((price) => ({
    label: (
      <div className="flex items-center gap-[5px]">
        <Image src={price.svg} className="w-full max-w-[20px] aspect-square" preview={false} />{price.currency}
      </div>),
    value: price.currency
  }))

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
    setAmount(data.send * exchangeRate);
    toast.success("Swap success");
  }

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      setExchangeRate(prices[fromCurrency]?.price / prices[toCurrency]?.price)
    }
  }, [fromCurrency, toCurrency, prices])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("https://interview.switcheo.com/prices.json")
        .then(res => res.json())
        .catch(err => {
          console.log(err);
          toast.error("Something went wrong while fetching prices")
        })

      const formattedPrices = res.reduce((acc, item) => {
        acc[item.currency] = {
          ...item,
          svg: `/tokens/${item.currency}.svg`
        }
        return acc
      }, {})

      setPrices(formattedPrices)
    }

    fetchData()
  }, [])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[url('/bg.jpg')]">
      <div className="w-[500px] bg-[rgba(170,187,204,0.2)] backdrop-blur-xl rounded-[8px] p-[20px] shadow-white">
        <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-center text-[24px] font-bold text-white">Swap Form</h1>
          <Controller
            control={control}
            name="send"
            rules={{ required: true }}
            render={({ field }) => (
              <div className="flex flex-col gap-[8px]">
                <label className="text-white text-[14px]">Amount to send</label>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter amount"
                  className="w-full h-[40px] rounded-[8px] px-[10px] mt-[10px] outline-none !bg-transparent !text-white placeholder:!text-[rgba(255,255,255,0.5)]"
                />
                {errors.send && <span className="text-red-500 text-[12px]">Amount is required</span>}
              </div>
            )}
          />

          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-[8px]">
              <p className="text-white text-[14px]">From</p>

              <Controller
                control={control}
                name="from"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-col gap-[8px]">
                    <Select
                      {...field}
                      className="w-[150px] h-[40px] rounded-[8px] px-[10px] mt-[10px] outline-none *:!bg-transparent *:!text-white placeholder:!text-[rgba(255,255,255,0.5)]"
                      options={selectOptions}
                      onChange={(value) => {
                        setFromCurrency(value);
                        field.onChange(value);
                      }}
                      value={fromCurrency}
                    />
                    {errors.from && <span className="text-red-500 text-[12px]">From currency is required</span>}
                  </div>
                )}
              />
            </div>

            <div className="flex flex-col pt-[25px]">
              <div className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#FFFFFF]">
                <SwapOutlined />
              </div>
            </div>

            <div className="flex flex-col gap-[8px]">
              <p className="text-white text-[14px]">To</p>
              <Controller
                control={control}
                name="to"
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-col gap-[8px]">
                    <Select
                      {...field}
                      className="w-[150px] h-[40px] rounded-[8px] px-[10px] mt-[10px] outline-none *:!bg-transparent *:!text-white placeholder:!text-[rgba(255,255,255,0.5)]"
                      options={selectOptions}
                      onChange={(value) => {
                        setToCurrency(value);
                        field.onChange(value);
                      }}
                    />
                    {errors.to && <span className="text-red-500 text-[12px]">To currency is required</span>}
                  </div>
                )}
              />

            </div>
          </div>

          <div className="flex flex-col gap-[8px]">
            <Input
              disabled
              placeholder="Exchange rate"
              className="w-full h-[40px] rounded-[8px] px-[10px] mt-[10px] outline-none !bg-transparent !text-white placeholder:!text-[rgba(255,255,255,0.5)]"
              value={exchangeRate ? `Exchange Rate: 1 ${fromCurrency} = ${exchangeRate.toFixed(6)} ${toCurrency}` : ""}
            />
          </div>

          <Button type="primary" htmlType="submit" loading={isSubmitting}>Swap</Button>

          <div className="flex flex-col gap-[8px]">
            <label className="text-white text-[14px]">Amount to receive</label>
            <Input
              disabled
              className="w-full h-[40px] rounded-[8px] px-[10px] mt-[10px] outline-none !bg-transparent !text-white placeholder:!text-[rgba(255,255,255,0.5)] text-center"
              value={amount ? `${amount.toFixed(6)} ${toCurrency}` : ""}
            />
          </div>

        </form>
      </div >
    </div >
  )
}

export default SwapForm