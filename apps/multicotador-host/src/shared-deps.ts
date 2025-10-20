// This file ensures shared dependencies are bundled in the host
// so they can be shared with remote modules via Module Federation
import React from 'react'
import ReactDOM from 'react-dom'
import { create } from 'zustand'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export { React, ReactDOM, create, z, useForm, zodResolver }
