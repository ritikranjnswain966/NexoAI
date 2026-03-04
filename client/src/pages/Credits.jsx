import React, { useEffect, useState } from 'react'
import Loading from './Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Credits = () => {

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const {token, axios} = useAppContext()

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
      headers: { Authorization: token }
      })
      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error(data.message || 'Failed to fetch plans.')
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const purchasePlan = async (planId) => {
  try {
    const { data } = await axios.post('/api/credit/purchase', {planId},{headers: { Authorization: token }})
    if (data.success) {
      window.location.href = data.url
    }else{
      toast.error(data.message)
    }
  }catch (error) {
    toast.error(error.message)
  }
}

  useEffect(() => {
    fetchPlans()
  }, [])

  if(loading) return <Loading />

  return (
    <div className='max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>Credits Plans</h2>
      
      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan) => (
          <div key={plan._id} className={`border border-indigo-100 dark:border-[#00FF41]/20 rounded-lg shadow hover:shadow-lg hover:dark:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === "pro" ? "bg-indigo-50 dark:bg-[#00FF41]/5" : "bg-white dark:bg-transparent"}`}>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
              <p className='text-2xl font-bold text-indigo-600 dark:text-white mb-4'>${plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-gray-400'>{' '}/{plan.credits} credits</span>
              </p>
              <ul className='space-y-2 mb-6'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-center text-gray-700 dark:text-gray-300'>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing...'})} className='w-full bg-indigo-500 hover:bg-indigo-600 dark:bg-[#00FF41] dark:hover:bg-[#00cc34] text-white dark:text-black font-semibold py-2 rounded-lg transition-colors'>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
