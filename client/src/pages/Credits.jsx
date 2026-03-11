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
    <div className='max-w-7xl overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12' style={{height: '100dvh'}}>
      <h2 className='text-3xl font-semibold text-center mb-10 xl:mt-30 text-gray-800 dark:text-white'>Credits Plans</h2>
      
      <div className='flex flex-wrap justify-center gap-8'>
        {plans.map((plan) => (
          <div key={plan._id} className={`border border-blue-100 dark:border-blue-500/20 rounded-lg shadow hover:shadow-lg hover:dark:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === "pro" ? "bg-blue-50 dark:bg-blue-500/5" : "bg-white dark:bg-transparent"}`}>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{plan.name}</h3>
              <p className='text-2xl font-bold text-blue-600 dark:text-white mb-4'>${plan.price}
                <span className='text-base font-normal text-gray-600 dark:text-gray-400'>{' '}/{plan.credits} credits</span>
              </p>
              <ul className='space-y-2 mb-6'>
                {plan.features.map((feature, index) => (
                  <li key={index} className='flex items-center text-gray-700 dark:text-gray-300'>{feature}</li>
                ))}
              </ul>
            </div>
            <button onClick={()=> toast.promise(purchasePlan(plan._id), {loading: 'Processing...'})} className='w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.4)]'>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
