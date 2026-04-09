import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  modals: Record<string, boolean>
  sidebarOpen: boolean
}

const initialState: UIState = {
  modals: {},
  sidebarOpen: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    }
  }
})

export const { openModal, closeModal, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
